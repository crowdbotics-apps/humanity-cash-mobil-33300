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

    def __init__(self, *args, main_profile=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.main_profile = main_profile

    def transaction_is_credit(self, obj):
        if isinstance(obj, Transaction):
            if obj.type == Transaction.Type.transfer:
                return obj.counterpart_profile == self.main_profile
            else:
                return obj.type == Transaction.Type.deposit
        else:  # is ACHTransaction
            return obj.type == ACHTransaction.Type.deposit

    def get_counterpart_data(self, obj):
        if isinstance(obj, Transaction):
            if obj.type == Transaction.Type.transfer:
                counterpart = obj.profile if obj.counterpart_profile == self.main_profile else obj.counterpart_profile

                return dict(
                    profile_picture=counterpart.profile_picture.url if counterpart and counterpart.profile_picture else None,
                    name=counterpart.display_name,
                    id=counterpart.id,
                    merchant=counterpart.is_merchant,
                )
        else:
            return None  # is ACHTransaction, or is blockchain transaction but is deposit / withdraw

    def get_credit(self, obj):
        return self.transaction_is_credit(obj)

    def get_created(self, obj):
        return obj.created_at if isinstance(obj, ACHTransaction) else obj.created


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
