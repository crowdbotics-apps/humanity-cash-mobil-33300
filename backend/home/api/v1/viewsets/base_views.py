from rest_framework import filters
from rest_framework.generics import ListAPIView, RetrieveAPIView
from cities_light.models import City, Region
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from home.api.v1.serializers.base_serializers import CityListSerializer, StateListSerializer, \
    WhereToSpendListSerializer, BusinessDetailsSerializer
from home.helpers import AuthenticatedAPIView
from users.constants import Industry
from users.models import Merchant


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


class WhereToSpendView(ListAPIView):
    queryset = Merchant.objects.all()
    http_method_names = ['get', 'head']
    filter_backends = [filters.SearchFilter]
    search_fields = ['business_name', 'industry']
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        categories = list(Industry.choices)
        cat_list = []
        queryset = self.filter_queryset(self.get_queryset())
        for cat in categories:
            qs = queryset.filter(industry=cat[0])
            cat_items_serializer = WhereToSpendListSerializer(qs, many=True, context={'request': request})
            cat_item = {cat[0]: cat_items_serializer.data}
            cat_list.append(cat_item)

        merchant = Merchant.objects.order_by('?').first()
        merchant_month = {
            'id': merchant.id,
            'business_name': merchant.business_name,
            'business_story': merchant.business_story
        }

        result = {
            'merchant_month': merchant_month,
            "merchants": cat_list
        }
        return Response(result)


class BusinessDetailsView(AuthenticatedAPIView, RetrieveAPIView):
    queryset = Merchant.objects.all()
    serializer_class = BusinessDetailsSerializer

