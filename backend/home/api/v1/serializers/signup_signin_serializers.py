import random

from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from phonenumber_field.validators import validate_international_phonenumber
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError
from home.api.v1.serializers.setup_profile_serializers import ConsumerProfileDetailSerializer, \
    MerchantMyProfileSerializer
from home.helpers import send_verification_email, setup_verification_code, send_verification_phone
from users.models import UserVerificationCode, Consumer

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'phone_number']
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

    def validate_phone_number(self, phone_number):
        if not phone_number:
            return None
        try:
            validate_international_phonenumber(phone_number)
        except Exception as error:
            raise error
        return phone_number

    def create(self, validated_data):
        phone_number = validated_data.get('phone_number', None)
        user = User(
            email=validated_data.get('email'),
            username=validated_data.get('email'),
            phone_number=phone_number
        )
        user.save()

        code = setup_verification_code(user)
        if phone_number:
            send_verification_phone(user, code, phone_number)

        send_verification_email(user, code)

        consumer = Consumer.objects.create(user=user)
        consumer.new_wallet()
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
    consumer_data = serializers.SerializerMethodField()
    merchant_data = serializers.SerializerMethodField()
    token = serializers.SerializerMethodField()
    group_name = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'verified_email', 'first_name', 'last_name', 'name', 'role_name',
            'email', 'username', 'password_set', 'group', 'role', 'group_name',
            'consumer_data', 'merchant_data', 'allow_touch_id', 'token'
            ]

    def get_group_name(self, obj):
        return obj.get_group_display()

    def get_role_name(self, obj):
        return obj.get_role_display()

    def get_password_set(self, obj):
        return obj.password is not None

    def get_consumer_data(self, obj):
        if obj.get_consumer_data:
            return ConsumerProfileDetailSerializer().to_representation(obj.get_consumer_data)

    def get_merchant_data(self, obj):
        if obj.get_merchant_data:
            return MerchantMyProfileSerializer().to_representation(obj.get_merchant_data)

    def get_token(self, obj):
        refresh = TokenObtainPairSerializer.get_token(obj)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class LoginSerializer(LoginSerializer):
    email = serializers.CharField(required=False, allow_blank=True)

    def _validate_username_email(self, username, email, password):
        if not username and not email:
            msg = _('Must include either "username" or "email" and "password".')
            raise ValidationError(msg)
        if User.objects.filter(email=email).exists():
            user = self.authenticate(email=email, password=password)
        else:
            user = self.authenticate(username=username, password=password)
        return user
