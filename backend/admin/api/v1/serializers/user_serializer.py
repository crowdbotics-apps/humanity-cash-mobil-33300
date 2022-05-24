from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import get_default_password_validators
from django.contrib.auth.tokens import default_token_generator
from rest_framework import serializers
from django.contrib.auth.views import INTERNAL_RESET_SESSION_TOKEN
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError

from home.helpers import get_user_by_uidb64

User = get_user_model()


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


class ResetPasswordConfirmSerializer(serializers.Serializer):
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    token_generator = default_token_generator

    def validate_token(self, token):
        INTERNAL_RESET_URL_TOKEN = 'set-password'
        user = get_user_by_uidb64(self.initial_data['uidb64'])
        if user is not None:
            if token == INTERNAL_RESET_URL_TOKEN:
                session_token = self.request.session.get(INTERNAL_RESET_SESSION_TOKEN)
                if self.token_generator.check_token(user, session_token):
                    return
            else:
                if self.token_generator.check_token(user, token):
                    self.request.session[INTERNAL_RESET_SESSION_TOKEN] = token
                    return
        raise serializers.ValidationError("Password reset unsuccessful")

    def validate_new_password2(self, password2):
        password1 = self.initial_data['new_password1']
        if password1 and password2:
            if password1 != password2:
                raise serializers.ValidationError("The two password fields didn't match.")
        return password2

    def validate_password(self, data):
        password_validators = get_default_password_validators()
        errors = []
        for validator in password_validators:
            try:
                validator.validate(data.get('new_password2'), get_user_by_uidb64(self.initial_data['uidb64']))
            except (ValidationError, DjangoValidationError) as error:
                errors.append(" ".join(error.messages))
        if errors:
            raise serializers.ValidationError(detail={'errors': errors})

    def validate(self, data):
        self.validate_password(data)
        return data


class UserAdminSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    physical_address = serializers.SerializerMethodField()
    account_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'full_name', 'email', 'last_login', 'physical_address', 'account_type')

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_account_type(self, obj):
        if obj.get_consumer_data:
            return 'Personal'
        elif obj.get_merchant_data:
            return 'Business'

    def get_physical_address(self, obj):
        if obj.get_consumer_data:
            return obj.consumer.address_1
        elif obj.get_merchant_data:
            return obj.merchant.address_1

