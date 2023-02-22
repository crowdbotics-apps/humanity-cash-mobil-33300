import logging

from rest_framework import viewsets, permissions, mixins, filters
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination

from celo_humanity.models import ACHTransaction
from home.api.v1.serializers.ach_transaction_serializers import ACHTransactionSerializer

logger = logging.getLogger('transaction')


class ACHTransactionViewSet(mixins.ListModelMixin,
                            mixins.RetrieveModelMixin,
                            viewsets.GenericViewSet):
    queryset = ACHTransaction.objects.all()
    serializer_class = ACHTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['transaction_id', 'ach_id', 'status', 'type']

    def get_queryset(self):
        user = self.request.user
        qs = super(ACHTransactionViewSet, self).get_queryset()
        status = self.request.query_params.get('status', None)
        if status is not None:
            qs = qs.filter(status=status)
        is_merchant = self.request.query_params.get('selected_account', 'merchant')
        if not user.role and not user.is_superuser:
            if is_merchant == 'merchant':
                qs = qs.filter(merchant=self.request.user.get_merchant_data())
            else:
                qs = qs.filter(consumer=self.request.user.get_consumer_data())
        return qs

