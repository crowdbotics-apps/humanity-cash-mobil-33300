from rest_framework import serializers
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter

from home.helpers import setup_verification_code, send_verification_email, send_reset_email
from users.models import User


class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id','name', 'first_name', 'last_name', 'role', 'group', 'is_admin', 'username', 'email']


class UserCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['name', 'role', 'group', 'email']


    def validate_email(self, email):
        if self.instance:
            user = User.objects.exclude(id=self.instance.id).filter(email=email).exists()
            if user:
                raise serializers.ValidationError("A user is already registered with this e-mail address.")
        else:
            email = get_adapter().clean_email(email)
            user = User.objects.filter(username=email).exists()
            if email and (email_address_exists(email) or user):
                raise serializers.ValidationError("A user is already registered with this e-mail address.")
        return email

    def validate_role(self, role):
        data = self.initial_data
        if data['group'] == 'MANAGER' and (role == 'EMPLOYEE' or role == 'SUPERVISOR'):
            raise serializers.ValidationError("Invalid role for group Super admin.")
        data = self.initial_data
        if data['group'] == 'BANK' and (role == 'ADMIN' or role == 'SUPERADMIN'):
            raise serializers.ValidationError("Invalid role for group Bank.")
        return role

    def create(self, validated_data):
        user = User(
            group=validated_data.get('group'),
            role=validated_data.get('role'),
            email=validated_data.get('email'),
            username=validated_data.get('email'),
            name=validated_data.get('name'),
            is_admin=True,
            verified_email=True
        )
        user.save()
        request = self.context.get('request')
        send_reset_email(user, request)
        return user