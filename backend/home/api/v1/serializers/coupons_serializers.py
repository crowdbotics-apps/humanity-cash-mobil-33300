from django.contrib.auth import get_user_model
from rest_framework import serializers

# from rest_auth.serializers import PasswordResetSerializer
from users.models import Coupon, ConsumerCoupon

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


class ConsumerCouponListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    promo_image = serializers.SerializerMethodField()
    id_cupon = serializers.SerializerMethodField()

    class Meta:
        model = ConsumerCoupon
        fields = ['id', 'title', 'promo_image', 'id_cupon']

    def get_title(self, obj):
        return obj.coupon.title

    def get_promo_image(self, obj):
        return obj.coupon.promo_image.url if obj.coupon.promo_image else None

    def get_id_cupon(self, obj):
        return obj.coupon.id


class ConsumerCouponCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsumerCoupon
        fields = ['consumer', 'coupon', 'active']


class ConsumerUpdateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsumerCoupon
        fields = ['active']
