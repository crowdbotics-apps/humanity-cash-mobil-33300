import random

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from home.helpers import send_verification_email
from users.models import UserVerificationCode

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']
        extra_kwargs = {
            'email': {
                'required': True,
                'allow_blank': False,
            }
        }

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def create(self, validated_data):
        user = User(
            email=validated_data.get('email'),
            username=validated_data.get('email')
        )
        user.save()
        send_verification_email(user)
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)
    password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password didn't match."})
        return super().validate(attrs)


class VerificationCodeSerializer(serializers.Serializer):
    verification_code = serializers.CharField(required=True, min_length=6, max_length=6)

    def validate(self, attrs):
        request = self.context['request']
        user = request.user
        verification_code = attrs['verification_code']
        verification_code_object = UserVerificationCode.objects.filter(
            user=user,
            verification_code=verification_code,
            expires_on__gt=timezone.now(),
            active=True
        ).first()
        if not verification_code_object:
            raise serializers.ValidationError({"verification_code": "Invalid code"})
        return verification_code_object


class UserDetailSerializer(serializers.ModelSerializer):
    password_set = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'verified_email', 'first_name', 'last_name',  'email', 'username', 'password_set']

    def get_password_set(self, obj):
        return obj.password is not None
