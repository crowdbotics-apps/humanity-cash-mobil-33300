from django.contrib.auth import get_user_model
from drf_extra_fields.geo_fields import PointField
from rest_framework import serializers

from users.models import Consumer, Merchant

User = get_user_model()


class ConsumerProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_empty_file=True)

    class Meta:
        model = Consumer
        fields = ['id', 'profile_picture']

    def to_representation(self, instance):
        ret = super(ConsumerProfileSerializer, self).to_representation(instance)
        ret['profile_picture'] = self.context['request'].build_absolute_uri(instance.profile_picture.url)
        return ret


class SetupConsumerProfileSerializer(serializers.ModelSerializer):
    consumer_profile = serializers.ImageField(required=False, allow_empty_file=True)
    has_consumer_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'consumer_profile', 'has_consumer_profile']

    def update(self, instance, validated_data):
        consumer_profile = validated_data.get('consumer_profile')

        consumer = Consumer.objects.create(user=instance)
        if consumer_profile:
            consumer.profile_picture = consumer_profile
            consumer.save()
        
        return super(SetupConsumerProfileSerializer, self).update(instance, validated_data)

    def validate(self, attrs):
        if hasattr(self.instance, 'consumer'):
            raise serializers.ValidationError({"username": "User already has a Personal profile"})
        return super().validate(attrs)

    def get_has_consumer_profile(self, obj):
        return hasattr(obj, 'consumer')


class SetupConsumerProfileDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']


class SetupMerchantProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_empty_file=True)
    background_picture = serializers.ImageField(required=False, allow_empty_file=True)
    has_business_profile = serializers.SerializerMethodField()

    class Meta:
        model = Merchant
        fields = ['id', 'business_name', 'profile_picture', 'background_picture', 'business_story', 'has_business_profile']

    def validate(self, attrs):
        if hasattr(self.context.get('request').user, 'merchant'):
            raise serializers.ValidationError({"business_name": "User already has a Business profile"})
        return super().validate(attrs)

    def get_has_business_profile(self, obj):
        return hasattr(self.context.get('request').user, 'merchant')


class SetupMerchantProfileDetailSerializer(serializers.ModelSerializer):
    location = PointField(required=False)

    class Meta:
        model = Merchant
        fields = ['id', 'business_name', 'type_of_business', 'business_story',
                  'owner_first_name', 'owner_last_name',
                  'registered_business_name', 'industry',
                  'employer_identification_number', 'social_security_number',
                  'address_1', 'address_2', 'city', 'state', 'location', 'zip_code', 'phone_number']


class ConsumerMyProfileSerializer(serializers.ModelSerializer):
    consumer_profile = serializers.ImageField(required=False, allow_empty_file=True)
    dwolla_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'consumer_profile', 'dwolla_id']

    def get_dwolla_id(self, obj):
        if obj.get_consumer_data:
            return obj.consumer.dwolla_id

    def to_representation(self, instance):
        ret = super(ConsumerMyProfileSerializer, self).to_representation(instance)
        ret['consumer_profile'] = self.context['request'].build_absolute_uri(instance.consumer.profile_picture.url)
        return ret

    def update(self, instance, validated_data):
        consumer_profile = validated_data.get('consumer_profile')

        consumer = Consumer.objects.get(user=instance)

        if consumer_profile:
            consumer.profile_picture = consumer_profile
            consumer.save()

        return super(ConsumerMyProfileSerializer, self).update(instance, validated_data)


class MerchantMyProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_empty_file=True)
    background_picture = serializers.ImageField(required=False, allow_empty_file=True)
    dwolla_id = serializers.CharField(read_only=True)
    location = PointField(required=False)

    class Meta:
        model = Merchant
        fields = ['id', 'business_name', 'type_of_business', 'business_story',
                  'profile_picture', 'background_picture',
                  'owner_first_name', 'owner_last_name',
                  'registered_business_name', 'industry', 'website',
                  'employer_identification_number', 'social_security_number', 'location',
                  'address_1', 'address_2', 'city', 'state', 'zip_code', 'phone_number', 'dwolla_id']


class ConsumerProfileDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Consumer
        fields = ['id', 'profile_picture', 'address_1', 'address_2', 'city', 'state', 'zip_code']
