from rest_framework import mixins
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter
from celo_humanity.models import Contract
from home.api.v1.serializers.contract_serializers import ContractSerializer


class ContractViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    queryset = Contract.objects.filter()
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]

