from django.contrib.auth import get_user_model
from rest_framework.generics import UpdateAPIView, DestroyAPIView
from home.functions import deactivate_dwolla_customer
from home.api.v1.serializers.security_serializers import ChangePasswordSerializer, AllowTouchIdSerializer, \
    DeleteAccountSerializer
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
    serializer_class = DeleteAccountSerializer

    def get_object(self):
        if self.request.user.get_consumer_data and self.request.user.consumer.dwolla_id:
            deactivate_dwolla_customer(self.request.user.consumer.dwolla_id)
        if self.request.user.get_merchant_data and self.request.user.merchant.dwolla_id:
            deactivate_dwolla_customer(self.request.user.merchant.dwolla_id)
        return self.request.user
