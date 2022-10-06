import logging

from rest_framework import viewsets, permissions, mixins
from rest_framework.filters import SearchFilter

from celo_humanity.models import ACHTransaction
from home.api.v1.serializers.ach_transaction_serializers import ACHTransactionSerializer
from home.api.v1.serializers.transaction_serializers import TransactionSerializer

logger = logging.getLogger('transaction')


class ACHTransactionViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    queryset = ACHTransaction.objects.filter()
    serializer_class = ACHTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['ach_id', 'transaction_id']
