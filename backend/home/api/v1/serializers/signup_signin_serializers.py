import random

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers

from home.helpers import send_email
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
        code = random.randint(100000, 999999)
        UserVerificationCode.objects.create(user=user, verification_code=code)
        subject = "Verification code"
        text_content = f"""<h5>Hello!</h5><br/>
        Please use the Verification code bellow to complete the verification process<br/>
        <b>{code}</b><br/>
        Thank you."""
        send_email(
            subject=subject,
            text_content=text_content,
            user_email=[user.email]
        )
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
    verification_code = serializers.CharField(required=True)

    def validate(self, attrs):
        request = self.context['request']
        user = request.user
        verification_code = attrs['verification_code']
        if len(verification_code) < 6:
            raise serializers.ValidationError({"verification_code": "Invalid code"})
        verification_code_object = UserVerificationCode.objects.filter(
            user=user,
            verification_code=verification_code,
            expires_on__gt=timezone.now(),
            active=True
        ).first()
        if not verification_code_object:
            raise serializers.ValidationError({"verification_code": "Invalid code"})
        return verification_code_object
