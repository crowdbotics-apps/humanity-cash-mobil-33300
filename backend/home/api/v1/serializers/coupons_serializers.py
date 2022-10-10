from django.contrib.auth import get_user_model
from rest_framework import serializers


# from rest_auth.serializers import PasswordResetSerializer
from users.models import Coupon

User = get_user_model()


class CounponListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            'id', 'title', 'start_date', 'end_date', 'type_of_promo', 'discount_input', 'description', 'promo_image',
            'merchant', 'created_at', 'modified_at'
        ]


class CounponCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['title', 'start_date', 'end_date', 'type_of_promo', 'discount_input', 'description', 'promo_image',
                  'merchant']

    def validate(self, attrs):
        start_date = attrs.get('start_date', None)
        end_date = attrs.get('end_date', None)
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({"start_date": "The start date cannot be grater than the end date"})
        return super().validate(attrs)
