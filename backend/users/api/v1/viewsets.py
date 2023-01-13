from rest_framework import mixins, viewsets, permissions, filters
from rest_framework.pagination import PageNumberPagination

from users.api.v1.serializers import UserDetailSerializer, UserCreateSerializer
from users.models import User


class UserAdminView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    queryset = User.objects.filter(role__isnull=False, group__isnull=False, is_admin=True)
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'first_name', 'last_name', 'role', 'group']

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserDetailSerializer