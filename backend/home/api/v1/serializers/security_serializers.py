from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class ChangePasswordSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True, required=False, validators=[validate_password], allow_blank=True)
    new_password_confirm = serializers.CharField(write_only=True, required=False, allow_blank=True)
    old_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    allow_touch_id = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = ('old_password', 'new_password', 'new_password_confirm', 'allow_touch_id')

    def validate(self, attrs):
        if attrs.get('new_password'):
            if not attrs.get('old_password'):
                raise serializers.ValidationError({"old_password": "Old Password is required."})
            if attrs.get('new_password') != attrs.get('new_password_confirm'):
                raise serializers.ValidationError({"new_password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        if value:
            user = self.context['request'].user
            if not user.check_password(value):
                raise serializers.ValidationError({"old_password": "Old password is not correct."})
            return value

    def update(self, instance, validated_data):
        if validated_data.get('new_password') and validated_data.get('new_password_confirm'):
            instance.set_password(validated_data['new_password'])
            instance.save()
        if validated_data.get('allow_touch_id') is not None:
            instance.allow_touch_id = validated_data.get('allow_touch_id')
            instance.save()

        return instance


class DeleteAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email')


class AllowTouchIdSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'allow_touch_id')
