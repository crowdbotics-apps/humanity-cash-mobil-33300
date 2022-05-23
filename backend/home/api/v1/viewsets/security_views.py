from django.contrib.auth import get_user_model
from rest_framework.generics import UpdateAPIView, DestroyAPIView

from home.api.v1.serializers.security_serializers import ChangePasswordSerializer, AllowTouchIdSerializer
from home.helpers import AuthenticatedAPIView


User = get_user_model()


class ChangePasswordView(AuthenticatedAPIView, UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user


class AllowTouchIdView(AuthenticatedAPIView, UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = AllowTouchIdSerializer

    def get_object(self):
        return self.request.user


class DeleteAccountView(AuthenticatedAPIView, DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user
