from django.contrib.auth.tokens import default_token_generator
from rest_framework import mixins, viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from allauth.account.adapter import get_adapter

from home.helpers import send_reset_email
from users import IsProgramManagerSuperAdmin, IsProgramManagerAdmin, IsBankSupervisor, IsBankEmployee
from users.api.v1.serializers import UserDetailSerializer, UserCreateSerializer, UserActivityListSerializer
from users.models import User, UserActivity


class UserAdminView(
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    queryset = User.objects.filter(role__isnull=False, group__isnull=False, is_admin=True, is_active=True).order_by('-id')
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsProgramManagerAdmin]
    pagination_class = PageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'first_name', 'last_name', 'role', 'group']

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'partial_update':
            return UserCreateSerializer
        return UserDetailSerializer

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

    @action(detail=True, methods=['post'])
    def email(self, request, *args, **kwargs):
        user = self.get_object()
        send_reset_email(user, request)
        return Response(status=status.HTTP_200_OK)


class ResetPasswordFormCustom(APIView):


    def post(self, request, **kwargs):
        email = request.data["email"]
        user = User.objects.filter(email=email).first()
        if user:
            send_reset_email(user, request)
        return Response(status=status.HTTP_200_OK)


class UserLoginDataView(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = UserActivity.objects.all().order_by('-id')
    serializer_class = UserActivityListSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id']
    # search_fields = ['id', 'user__first_name', 'user__last_name', 'user__email', 'user__username']