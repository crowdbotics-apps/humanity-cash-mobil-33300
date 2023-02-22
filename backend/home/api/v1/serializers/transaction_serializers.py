from json import JSONDecodeError

from django.contrib.auth import get_user_model
from rest_framework import serializers
# from rest_auth.serializers import PasswordResetSerializer
from rest_framework.exceptions import ValidationError

from celo_humanity.humanity_contract_helpers import uid_to_wallet
from celo_humanity.models import Transaction, ACHTransaction
import json
from rest_framework import status

from home.api.v1.serializers.setup_profile_serializers import ConsumerProfileDetailSerializer, \
    MerchantMyProfileSerializer
from users.constants import UserGroup, UserRole

User = get_user_model()


class TransactionMobileSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    transaction_id = serializers.CharField(min_length=255)
    type = serializers.CharField(min_length=255)
    amount = serializers.DecimalField(6, 2)
    counterpart_data = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    credit = serializers.SerializerMethodField()

    class Meta:
        fields = (
            'id',
            'transaction_id',
            'type',
            'amount',
            'counterpart_data',
            'created',
            'credit'
        )
    @staticmethod
    def transaction_is_credit(obj):
        if hasattr(obj, 'counterpart_consumer') or hasattr(obj, 'counterpart_merchant'):
            if obj.counterpart_consumer or obj.counterpart_merchant:
                return False, 'TRN'
            else:
                return True, 'TRN'
        else:
            if obj.type == ACHTransaction.Type.withdraw:
                return False, 'ACH'
            else:
                return True, 'ACH'
    def get_counterpart_data(self, obj):
        is_credit, type_of_transaction = self.transaction_is_credit(obj)
        if type_of_transaction == 'TRN':
            if is_credit:
                consumer = obj.consumer
                merchant = obj.merchant
                if consumer:
                    return  {
                        "profile_picture": consumer.profile_picture.url if consumer.profile_picture else None,
                        "name": consumer.user.get_full_name(),
                        "id": consumer.id,
                    }
                else:
                    return  {
                        "profile_picture": merchant.profile_picture.url if merchant.profile_picture else None,
                        "name": merchant.business_name,
                        "id": merchant.id,
                    }
            else:
                consumer = obj.counterpart_consumer
                merchant = obj.counterpart_merchant
                if consumer:
                    return  {
                        "profile_picture": consumer.profile_picture.url if consumer.profile_picture else None,
                        "name": consumer.user.get_full_name(),
                        "id": consumer.id,
                    }
                else:
                    return  {
                        "profile_picture": merchant.profile_picture.url if merchant.profile_picture else None,
                        "name": merchant.business_name,
                        "id": merchant.id,
                    }
        return None

    def get_credit(self, obj):
        is_credit, _ = self.transaction_is_credit(obj)
        return is_credit

    def get_created(self, obj):
        _, type_of_transaction = self.transaction_is_credit(obj)
        if type_of_transaction == 'ACH':
            return obj.created_at
        return obj.created
class TransactionSerializer(serializers.ModelSerializer):
    from_address = serializers.SerializerMethodField()
    to_address = serializers.SerializerMethodField()
    from_username = serializers.SerializerMethodField()
    to_username = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    consumer_data = serializers.SerializerMethodField()
    merchant_data = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'created', 'confirmations',
            'from_address', 'to_address', 'from_username', 'to_username',
            'type', 'amount', 'consumer_data', 'merchant_data'
        ]

    def get_from_address(self, obj):
        if obj.consumer_id:
            return uid_to_wallet(obj.consumer.crypto_wallet_id)
        if obj.merchant_id:
            return uid_to_wallet(obj.merchant.crypto_wallet_id)
        return '-'

    def get_to_address(self, obj):
        if obj.counterpart_consumer_id:
            return uid_to_wallet(obj.counterpart_consumer.crypto_wallet_id)
        if obj.counterpart_merchant_id:
            return uid_to_wallet(obj.counterpart_merchant.crypto_wallet_id)
        return '-'

    def validate_params(self, data):
        show_username = False
        password_is_valid = False
        if 'show_username' in data.keys():
            show_username = data['show_username']
        if 'password' in data.keys():
            password_is_valid = self.context['request'].user.check_password(data['password'])
            if show_username and not password_is_valid:
                raise ValidationError("You are not allowed to see usernames", code=status.HTTP_401_UNAUTHORIZED)
        return show_username, password_is_valid

    def get_from_username(self, obj):
        data = self.context['request'].data
        username = '-'
        show_username, password_is_valid = self.validate_params(data)
        if not show_username:
            try:
                data = json.loads(obj.receipt)
                if 'from' in data.keys():
                    username = data['from']
            except JSONDecodeError:
                username = 'unknown'
        elif show_username and password_is_valid:
            if obj.consumer_id:
                username = obj.consumer.user.username
            if obj.merchant_id:
                username = obj.merchant.user.username
        return username

    def get_to_username(self, obj):
        data = self.context['request'].data
        username = '-'
        show_username, password_is_valid = self.validate_params(data)

        if not show_username:
            try:
                receipt = json.loads(obj.receipt)
                if 'to' in receipt.keys():
                    username = receipt['to']
            except JSONDecodeError:
                username = 'unknown'
        elif show_username and password_is_valid:
            if obj.counterpart_consumer_id:
                username = obj.counterpart_consumer.user.username
            if obj.counterpart_merchant_id:
                username = obj.counterpart_merchant.user.username
        return username

    def get_type(self, obj):
        return obj.get_type_display()

    def get_consumer_data(self, obj):
        consumer_data = obj.get_consumer_data
        if consumer_data:
            return ConsumerProfileDetailSerializer(consumer_data).data
        return None

    def get_merchant_data(self, obj):
        merchant_data = obj.get_merchant_data
        if merchant_data:
            return MerchantMyProfileSerializer(merchant_data).data
        return None


class SendQRSerializer(serializers.Serializer):
    qr_data = serializers.JSONField()
    email = serializers.EmailField()


class SendReportSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()


class AdminWalletActionSerializer(serializers.Serializer):
    is_consumer = serializers.BooleanField()
    id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=['community_chest_recipient', 'humanity_transfer'])
    amount = serializers.FloatField(required=False)

    class Meta:
        fields = [
            'action',
            'is_consumer',
            'id',
            'amount',
        ]

    def validate(self, attrs):
        if attrs['action'] == 'humanity_transfer':
            if attrs['amount'] is None or attrs['amount'] <= 0.5:
                raise ValidationError("Invalid amount for transfer")
            attrs['amount'] = int(attrs['amount'] * 100) / 100.0
        return attrs
