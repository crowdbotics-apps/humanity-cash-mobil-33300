from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter

from celo_humanity.models import Transaction
from home.api.v1.serializers.transaction_serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.filter()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['transaction_id']

    def get_serializer_class(self):
        res = super(TransactionViewSet, self).get_serializer_class()
        return res
