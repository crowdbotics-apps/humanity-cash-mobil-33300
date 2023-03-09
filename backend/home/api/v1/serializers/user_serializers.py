import logging

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers

# from rest_auth.serializers import PasswordResetSerializer
from rest_framework.exceptions import ValidationError
from websockets.exceptions import ConnectionClosedOK

from celo_humanity.humanity_contract_helpers import NoWalletException
from home.api.v1.serializers.ach_transaction_serializers import ACHTransactionSerializer
from home.api.v1.serializers.transaction_serializers import TransactionSerializer
from users.models import Consumer, DwollaUser, Merchant

User = get_user_model()
logger = logging.getLogger('django')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']


# class PasswordSerializer(PasswordResetSerializer):
#     """Custom serializer for rest_auth to solve reset password error"""
#     password_reset_form_class = ResetPasswordForm

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, max_length=254)

    def validate_email(self, email):
        active_users = User._default_manager.filter(**{
            '%s__iexact' % User.get_email_field_name(): email,
            'is_active': True,
        })
        if len([u for u in active_users if u.has_usable_password()]) == 0:
            raise serializers.ValidationError("The e-mail address is not assigned to any user account")
        return email


class ConsumerSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    last_login = serializers.SerializerMethodField()


    class Meta:
        model = Consumer
        fields = ['id', 'balance', 'full_name', 'address_1', 'email', 'dwolla_id', 'crypto_wallet_id', 'last_login']

    def get_balance(self, obj):
        return obj.balance

    def get_full_name(self, obj):
        return obj.user.name

    def get_email(self, obj):
        return obj.user.email

    def get_last_login(self, obj):
        return obj.user.last_login


class DwollaUserSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = DwollaUser
        fields = ['id', 'balance', 'name', 'address', 'email', 'dwolla_id',
                  'crypto_wallet_id', 'last_login', 'date_joined', 'account_type', 'username', 'profile_picture']

    def get_balance(self, obj):
        try:
            return obj.profile.balance
        except (TimeoutError, NoWalletException, RuntimeError, ConnectionClosedOK,
                Merchant.DoesNotExist, Consumer.DoesNotExist) as error:
            logger.exception('Contract Error: {}'.format(error))
            return '-'

    def get_username(self, obj):
        return obj.profile.display_name

    def get_profile_picture(self, obj):
        return obj.profile.profile_picture.url if obj.profile.profile_picture else None


class DwollaUserDetailVerifySerializer(serializers.Serializer):
    password = serializers.CharField()
    type = serializers.CharField()

    class Meta:
        fields = ('password', 'type')

    def validate_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise ValidationError('User password is incorrect')
        return value

    def validate_type(self, value):
        if value not in ['BUSINESS', 'PERSONAL']:
            raise ValidationError('incorrect profile selected')
        return value



class ConsumerDetailUserSerializer(serializers.ModelSerializer):
    state = serializers.CharField(source='state.name_ascii')

    class Meta:
        model = Consumer
        fields = ['id', 'address_1', 'address_2', 'city', 'state', 'zip_code']


class MerchantDetailUserSerializer(serializers.ModelSerializer):
    state = serializers.CharField(source='state.name_ascii')

    class Meta:
        model = Merchant
        fields = ['id', 'address_1', 'address_2', 'city', 'state', 'zip_code']

class DwollaUserDetailSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()
    blockchain_transactions = serializers.SerializerMethodField()
    ach_transactions = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()

    class Meta:
        model = DwollaUser
        fields = ['id', 'balance', 'name', 'address', 'email', 'dwolla_id', 'blockchain_transactions','ach_transactions',
                  'crypto_wallet_id', 'last_login', 'date_joined', 'account_type', 'profile', 'full_name']

    def get_balance(self, obj):
        try:
            return obj.profile.balance
        except (TimeoutError, NoWalletException, RuntimeError, ConnectionClosedOK,
                Merchant.DoesNotExist, Consumer.DoesNotExist) as error:
            logger.exception('Contract Error: {}'.format(error))
            return '-'

    def get_blockchain_transactions(self, obj):
        transactions = obj.profile.transactions.all()
        return TransactionSerializer(
            instance=transactions, many=True, context={'request': self.context['request']}
        ).data

    def get_ach_transactions(self, obj):
        transactions = obj.profile.ach_transactions.all()
        return ACHTransactionSerializer(
            instance=transactions, many=True, context={'request': self.context['request']}
        ).data

    def get_full_name(self, obj):
        user = User.objects.get(pk=obj.pk)
        return user.get_full_name()

    def get_profile(self, obj):
        profile = obj.profile
        serializer_class = MerchantDetailUserSerializer if profile.is_merchant else ConsumerDetailUserSerializer
        return serializer_class(instance=profile).data