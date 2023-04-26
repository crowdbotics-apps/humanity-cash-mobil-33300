from rest_framework import serializers
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter

from home.helpers import setup_verification_code, send_verification_email, send_reset_email, generate_reset_url, \
    send_email_with_template
from users.models import User, UserActivity


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
            user = User.objects.filter(username=email, role__isnull=False).first()
            if user and not user.is_active:
                user.is_active = True
                user.save()
            elif user and user.is_active:
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
        user = User.objects.filter(username=validated_data.get('email')).first()
        if not user:
            user = User(
                group=validated_data.get('group'),
                role=validated_data.get('role'),
                email=validated_data.get('email'),
                username=validated_data.get('email'),
                name=validated_data.get('name'),
                is_admin=True,
                verified_email=True
            )
        else:
            user.group = validated_data.get('group')
            user.role = validated_data.get('role')
            user.name = validated_data.get('name')
            user.is_admin = True
            user.verified_email = True
        user.save()
        request = self.context.get('request')
        send_email_with_template(
            subject='Activate your Humanity Cash Admin account',
            email=user.email,
            template_to_load='emails/admin_user_email.html',
            context={
                "username": user.username,
                "set_password_link": generate_reset_url(user, request),
            }
        )
        return user


class UserActivityListSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserActivity
        fields = ['id', 'login', 'session_key']


class UserActivityAdminListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')

    class Meta:
        model = UserActivity
        fields = ['id', 'login', 'session_key', 'username', 'email']