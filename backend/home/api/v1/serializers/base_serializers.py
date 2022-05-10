from rest_framework import serializers
from cities_light.models import City, Region


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
