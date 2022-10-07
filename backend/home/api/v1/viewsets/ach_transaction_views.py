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
    queryset = ACHTransaction.objects.all()
    serializer_class = ACHTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['ach_id', 'transaction_id', ]

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        qs = super(ACHTransactionViewSet, self).get_queryset()
        status = self.request.query_params.get('status')
        if status is not None:
            qs = qs.filter(status=status)
        return qs

