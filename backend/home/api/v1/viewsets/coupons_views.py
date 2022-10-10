import logging

from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, permissions, mixins
from rest_framework.filters import SearchFilter

from celo_humanity.models import ACHTransaction
from home.api.v1.serializers.ach_transaction_serializers import ACHTransactionSerializer
from home.api.v1.serializers.coupons_serializers import CounponListSerializer, CounponCreateSerializer
from home.api.v1.serializers.transaction_serializers import TransactionSerializer
from users.models import Coupon

logger = logging.getLogger('transaction')


class CouponsView(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Coupon.objects.filter(active=True)
    serializer_class = CounponListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = super(CouponsView, self).get_queryset()
        now = timezone.now()
        qs = queryset.filter(
            Q(start_date__isnull=True) | Q(start_date__lte=now), Q(end_date__isnull=True) | Q(end_date__gte=now)
        )
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return CounponCreateSerializer
        else:
            return CounponListSerializer
