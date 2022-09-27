import django_filters
from django.contrib.auth import get_user_model
from rest_framework import serializers, viewsets, status, permissions, mixins
from rest_framework.response import Response

from home.api.v1.serializers.signup_signin_serializers import UserDetailSerializer
from home.api.v1.serializers.user_serializers import ConsumerSerializer
from users.constants import UserGroup, UserRole
from rest_framework import filters

from users.models import Consumer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True, is_superuser=False)
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['^name']

    def get_queryset(self):
        qs = super(UserViewSet, self).get_queryset()
        group_filter = []
        if self.request.GET.get('group_bank', '') == 'true':
            group_filter.append(UserGroup.BANK)
        if self.request.GET.get('group_manager', '') == 'true':
            group_filter.append(UserGroup.PROGRAM_MANAGER)
        if group_filter:
            qs = qs.filter(group__in=group_filter)
        if self.request.GET.get('role', '') == 'true':
            qs = qs.filter(role=UserRole.SUPER_ADMIN)
        if name := self.request.GET.get('name', ''):
            qs = qs.filter(name__istartswith=name)
        return qs

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active'])


class ConsumerViewSet(mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      viewsets.GenericViewSet):
    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerializer
    permission_classes = [permissions.IsAuthenticated]
    # filter_backends = [filters.SearchFilter]
    # search_fields = ['^name']
