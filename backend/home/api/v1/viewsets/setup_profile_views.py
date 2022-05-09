from django.contrib.auth import get_user_model
from rest_framework.generics import UpdateAPIView, CreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser

from home.api.v1.serializers import setup_profile_serializers
from home.helpers import AuthenticatedAPIView
from users.models import Merchant

User = get_user_model()


class SetupConsumerProfileAPIView(AuthenticatedAPIView, UpdateAPIView):
    """
    Endpoint to set up Consumer Profile after first log in
    """
    serializer_class = setup_profile_serializers.SetupConsumerProfileSerializer
    parser_classes = (MultiPartParser, FormParser)
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class SetupConsumerProfileDetailAPIView(AuthenticatedAPIView, UpdateAPIView):
    """
    Endpoint to set up Consumer Profile Details after first log in
    """
    serializer_class = setup_profile_serializers.SetupConsumerProfileDetailSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class SetupMerchantProfileAPIView(AuthenticatedAPIView, CreateAPIView):
    """
    Endpoint to set up Merchant Profile after first log in
    """
    serializer_class = setup_profile_serializers.SetupMerchantProfileSerializer
    parser_classes = (MultiPartParser, FormParser)
    queryset = Merchant.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SetupMerchantProfileDetailAPIView(AuthenticatedAPIView, UpdateAPIView):
    """
    Endpoint to set up Merchant Profile Details after first log in
    """
    serializer_class = setup_profile_serializers.SetupMerchantProfileDetailSerializer
    queryset = Merchant.objects.all()

    def get_object(self):
        return self.request.user.merchant

