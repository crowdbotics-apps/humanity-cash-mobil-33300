from django.db.models import Q
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

    def get_queryset(self):
        qs = super(TransactionViewSet, self).get_queryset()
        if user_id := self.request.GET.get('user', False):
            qs = qs.filter(Q(consumer__user_id=user_id) |
                           Q(merchant__user_id=user_id) |
                           Q(counterpart_consumer__user_id=user_id) |
                           Q(counterpart_merchant__user_id=user_id) )
        return qs

    def get_serializer_class(self):
        res = super(TransactionViewSet, self).get_serializer_class()
        return res
