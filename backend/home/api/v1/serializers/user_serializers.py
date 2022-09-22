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
from users.models import Consumer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']


# class PasswordSerializer(PasswordResetSerializer):
#     """Custom serializer for rest_auth to solve reset password error"""
#     password_reset_form_class = ResetPasswordForm

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






