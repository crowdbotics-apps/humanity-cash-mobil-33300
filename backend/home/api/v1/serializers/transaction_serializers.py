from django.contrib.auth import get_user_model
from rest_framework import serializers
# from rest_auth.serializers import PasswordResetSerializer
from rest_framework.exceptions import ValidationError

from celo_humanity.models import Transaction
import json
from rest_framework import status

from home.api.v1.serializers.setup_profile_serializers import ConsumerProfileDetailSerializer, \
    MerchantMyProfileSerializer
from users.constants import UserGroup, UserRole

User = get_user_model()

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
        address = '-'
        if obj.consumer_id:
            address = obj.consumer.crypto_wallet_id
        if obj.merchant_id:
            address = obj.merchant.crypto_wallet_id
        return address

    def get_to_address(self, obj):
        address = '-'
        if obj.counterpart_consumer_id:
            address = obj.counterpart_consumer.crypto_wallet_id
        if obj.counterpart_merchant_id:
            address = obj.counterpart_merchant.crypto_wallet_id
        return address

    def get_from_username(self, obj):
        data = self.context['request'].GET
        username = '-'
        show_username, password_is_valid = self.validate_params(data)
        if not show_username:
            data = json.loads(obj.receipt)
            if 'from' in data.keys():
                username = data['from']
        elif show_username and password_is_valid:
            if obj.consumer_id:
                username = obj.consumer.user.username
            if obj.merchant_id:
                username = obj.merchant.user.username
        return username

    def validate_params(self, data):
        show_username = False
        password_is_valid = False
        if 'show_username' in data.keys():
            show_username = data['show_username'] == "true"
        if 'password' in data.keys():
            password_is_valid = self.context['request'].user.check_password(data['password'])

            if show_username and not password_is_valid:
                raise ValidationError(detail={"errors":["You are not allowed to see usernames"]}, code=status.HTTP_401_UNAUTHORIZED)
        return show_username, password_is_valid


    def get_to_username(self, obj):
        data = self.context['request'].GET
        username = '-'
        show_username, password_is_valid = self.validate_params(data)

        if not show_username:
            receipt = json.loads(obj.receipt)
            if 'to' in receipt.keys():
                username = receipt['to']
        elif show_username and password_is_valid:
            if obj.counterpart_consumer_id:
                username = obj.counterpart_consumer.user.username
            if obj.counterpart_merchant_id:
                username = obj.counterpart_merchant.user.username
        return username


    def get_type(self, obj):
        return obj.get_type_display()

    @property
    def get_consumer_data(self, obj):
        if obj.get_consumer_data:
            return ConsumerProfileDetailSerializer().to_representation(obj.get_consumer_data)


    @property
    def get_merchant_data(self, obj):
        if obj.get_consumer_data:
            return MerchantMyProfileSerializer().to_representation(obj.get_merchant_data)


class SendQRSerializer(serializers.Serializer):
    qr_data = serializers.JSONField()
    email = serializers.EmailField()

