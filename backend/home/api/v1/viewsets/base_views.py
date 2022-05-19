from rest_framework import filters
from rest_framework.generics import ListAPIView, RetrieveAPIView
from cities_light.models import City, Region

from home.api.v1.serializers.base_serializers import CityListSerializer, StateListSerializer
from home.helpers import AuthenticatedAPIView


class CityListView(AuthenticatedAPIView, ListAPIView):
    queryset = City.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['^display_name', ]
    serializer_class = CityListSerializer


class CityRetrieveView(AuthenticatedAPIView, RetrieveAPIView):
    queryset = City.objects.all()
    serializer_class = CityListSerializer


class StateListView(AuthenticatedAPIView, ListAPIView):
    queryset = Region.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['^geoname_code', ]
    serializer_class = StateListSerializer


class StateRetrieveView(AuthenticatedAPIView, RetrieveAPIView):
    queryset = Region.objects.all()
    serializer_class = StateListSerializer
