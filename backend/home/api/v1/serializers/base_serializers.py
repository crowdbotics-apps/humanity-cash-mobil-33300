from rest_framework import serializers
from cities_light.models import City, Region
from rest_framework.generics import RetrieveAPIView

from users.models import Merchant


class CityListSerializer(serializers.ModelSerializer):
    city_id = serializers.IntegerField(source='id')
    city_name = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = ('city_id', 'city_name')

    def get_city_name(self, obj):
        return obj.display_name.rsplit(',', maxsplit=1)[0]


class StateListSerializer(serializers.ModelSerializer):
    state_id = serializers.IntegerField(source='id')
    state_code = serializers.CharField(source='geoname_code')

    class Meta:
        model = Region
        fields = ('state_id', 'state_code')


class WhereToSpendListSerializer(serializers.ModelSerializer):
    background_picture = serializers.SerializerMethodField()

    class Meta:
        model = Merchant
        fields = ['id', 'background_picture', 'business_name', 'website']

    def get_background_picture(self, obj):
        if obj.background_picture:
            return self.context['request'].build_absolute_uri(obj.background_picture.url)


class BusinessDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Merchant
        fields = ['id', 'business_name', 'business_story', 'background_picture',
                  'address_1', 'address_2', 'zip_code', 'city', 'state', 'website']


class SendQrCodeSerializer(serializers.Serializer):
    qr_code_image = serializers.ImageField()
