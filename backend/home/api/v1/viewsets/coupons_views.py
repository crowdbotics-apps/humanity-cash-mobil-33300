import logging

from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.filters import SearchFilter
from rest_framework.response import Response

from home.api.v1.serializers.coupons_serializers import CounponListSerializer, CounponCreateSerializer, \
    ConsumerCouponListSerializer, ConsumerCouponCreateSerializer, ConsumerUpdateCreateSerializer
from users.models import Coupon, Merchant, ConsumerCoupon

logger = logging.getLogger('transaction')


class CouponsView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    queryset = Coupon.objects.all()
    serializer_class = CounponListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description']

    @staticmethod
    def verify_merchant(user, merchant_id):
        merchant = Merchant.objects.filter(user=user).first()
        if not merchant:
            return False
        return merchant.id == int(merchant_id)

    def get_queryset(self):
        user = self.request.user
        queryset = super(CouponsView, self).get_queryset()
        query_params = self.request.query_params.get('merchant_id', None)
        if query_params and self.verify_merchant(user, query_params):
            return queryset.filter(merchant=user.merchant)
        now = timezone.now()
        qs = queryset.filter(
            Q(start_date__isnull=True) | Q(start_date__lte=now), Q(end_date__isnull=True) | Q(end_date__gte=now) | Q(active=False)
        )
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return CounponCreateSerializer
        return CounponListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        if not self.verify_merchant(user, request.data['merchant']):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.request.user
        if not self.verify_merchant(user, instance.merchant.id):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ConsumerCouponView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = ConsumerCouponListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = ConsumerCoupon.objects.filter(active=True, coupon__active=True, consumer__user=self.request.user)
        now = timezone.now()
        qs = queryset.filter(
            Q(coupon__start_date__isnull=True) | Q(coupon__start_date__lte=now),
            Q(coupon__end_date__isnull=True) | Q(coupon__end_date__gte=now)
        )
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return ConsumerCouponCreateSerializer
        if self.action == 'update':
            return ConsumerUpdateCreateSerializer
        return ConsumerCouponListSerializer
