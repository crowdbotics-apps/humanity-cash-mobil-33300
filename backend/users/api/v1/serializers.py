from rest_framework import serializers

from users.models import User


class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id','name', 'first_name', 'last_name', 'role', 'group', 'is_admin', 'username']