from django.contrib.auth import get_user_model
from rest_framework import serializers, viewsets, status
from rest_framework.response import Response

from home.api.v1.serializers.signup_signin_serializers import UserDetailSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True, is_superuser=False)
    serializer_class = UserDetailSerializer
    permission_classes = []
    page_size = 1


    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active'])
