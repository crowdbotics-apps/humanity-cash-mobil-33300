from rest_framework import serializers

from users.models import Notification


class UserIdPushTokenSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    push_token = serializers.CharField(allow_null=True, allow_blank=True)
    active = serializers.BooleanField()


class NotificationListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ['id', 'target', 'from_user', 'title', 'description', 'timestamp', 'extra_data', 'read', 'type']
