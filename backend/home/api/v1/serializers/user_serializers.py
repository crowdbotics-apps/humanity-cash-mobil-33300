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

from celo_humanity.humanity_contract_helpers import NoWalletException
from users.models import Consumer, DwollaUser

User = get_user_model()


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

    class Meta:
        model = DwollaUser
        fields = ['id', 'balance', 'name', 'address', 'email', 'dwolla_id',
                  'crypto_wallet_id', 'last_login', 'date_joined', 'account_type']

    def get_balance(self, obj):
        try:
            user = User.objects.get(pk=obj.pk)
            if hasattr(user, 'merchant'):
                return user.merchant.balance

            if hasattr(user, 'consumer'):
                return user.consumer.balance
        except (TimeoutError, NoWalletException) as error:
            return '-'

class DwollaUserDetailVerifySerializer(serializers.Serializer):
    password = serializers.CharField()
    type = serializers.CharField()

    class Meta:
        fields = ('password',)

    def validate_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise ValidationError('User password is incorrect')
        return value

