from rest_framework import mixins, filters
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination

from celo_humanity.models import Contract
from home.api.v1.serializers.contract_serializers import ContractSerializer


class ContractViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    queryset = Contract.objects.filter()
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['contract_name', 'description', 'deployed_address', 'version']

