from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from rest_framework import filters, status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from cities_light.models import City, Region
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base import configs
from celo_humanity.humanity_contract_helpers import get_community_balance
from home.api.v1.serializers.base_serializers import CityListSerializer, StateListSerializer, \
    WhereToSpendListSerializer, BusinessDetailsSerializer, SendQrCodeSerializer
from home.helpers import AuthenticatedAPIView, send_qr_code_email
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
    search_fields = ['^display_name', ]
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
            if qs.exists():
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

    def get_queryset(self):
        queryset = self.queryset
        latitude = self.request.data.get('latitude')
        longitude = self.request.data.get('longitude')
        industry = self.request.data.get('industry')
        distance = self.request.data.get('distance')
        if industry:
            queryset = queryset.filter(industry=industry)
        if latitude and longitude and distance:
            latitude = float(latitude)
            longitude = float(longitude)
            user_location = Point(x=longitude, y=latitude, srid=4326)
            queryset = queryset.filter(location__distance_lte=(user_location, D(mi=distance)))\
                .only('id', 'business_name', 'business_story', 'background_picture', 'website', 'location').annotate(
                distance=Distance('location', user_location)).order_by('distance')
            # queryset = queryset.annotate(distance=Distance('location', user_location)).order_by('distance')

        return queryset


class BusinessDetailsView(AuthenticatedAPIView, RetrieveAPIView):
    queryset = Merchant.objects.all()
    serializer_class = BusinessDetailsSerializer


class SendQrCodeView(AuthenticatedAPIView):
    serializer_class = SendQrCodeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        send_qr_code_email(user=request.user, qr_code_image=serializer.validated_data.get('qr_code_image'))

        return Response(status=status.HTTP_200_OK)


class CommunityChestView(APIView):

    def get(self, request):
        data = dict(
            goal=float(configs.HUMANITY_CHEST_GOAL),
            balance=get_community_balance(),
            achievements1=configs.HUMANITY_CHEST_ACHIEVEMENTS1,
            achievements2=configs.HUMANITY_CHEST_ACHIEVEMENTS2,
        )

        return Response(data, status=status.HTTP_200_OK)
