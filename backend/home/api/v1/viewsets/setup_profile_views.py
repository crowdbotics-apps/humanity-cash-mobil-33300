import logging
from django.contrib.auth import get_user_model
from rest_framework.generics import UpdateAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from home.api.v1.serializers import setup_profile_serializers
from home.clients.dwolla_api import DwollaClient
from home.functions import create_dwolla_customer_consumer, create_dwolla_customer_merchant
from home.helpers import AuthenticatedAPIView
from users.models import Merchant

User = get_user_model()
logger = logging.getLogger('django')


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

    def update(self, request, *args, **kwargs):
        super(SetupConsumerProfileDetailAPIView, self).update(request, *args, **kwargs)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)

        if not self.request.user.consumer.dwolla_id:
            # if dwolla_id is not set yet
            create_dwolla_customer_consumer(instance)

        return Response(serializer.initial_data)


class SetupMerchantProfileAPIView(AuthenticatedAPIView, CreateAPIView):
    """
    Endpoint to set up Merchant Profile after first log in
    """
    serializer_class = setup_profile_serializers.SetupMerchantProfileSerializer
    parser_classes = (MultiPartParser, FormParser)
    queryset = Merchant.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SetupMerchantProfileDetailAPIView(AuthenticatedAPIView, RetrieveUpdateAPIView):
    """
    Endpoint to set up Merchant Profile Details after first log in
    """
    serializer_class = setup_profile_serializers.SetupMerchantProfileDetailSerializer
    queryset = Merchant.objects.all()

    def get_object(self):
        return self.request.user.merchant

    def update(self, request, *args, **kwargs):
        super(SetupMerchantProfileDetailAPIView, self).update(request, *args, **kwargs)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)

        if not self.request.user.merchant.dwolla_id:
            # if dwolla_id is not set yet
            create_dwolla_customer_merchant(instance)

        return Response(serializer.initial_data)


class ConsumerMyProfileAPIView(AuthenticatedAPIView, RetrieveUpdateAPIView):
    """
    Endpoint to view and edit Consumer Profile
    """
    serializer_class = setup_profile_serializers.ConsumerMyProfileSerializer
    parser_classes = (MultiPartParser, FormParser)
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        super(ConsumerMyProfileAPIView, self).update(request, *args, **kwargs)

        instance = self.get_object()
        request.data.pop('consumer_profile')
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if not self.request.user.consumer.dwolla_id:
            # if dwolla_id is not set yet
            create_dwolla_customer_consumer(instance)

        return Response(serializer.data)


class MerchantMyProfileDetailAPIView(AuthenticatedAPIView, RetrieveUpdateAPIView):
    """
    Endpoint to view and edit Merchant Profile
    """
    serializer_class = setup_profile_serializers.MerchantMyProfileSerializer
    queryset = Merchant.objects.all()
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user.merchant

    def update(self, request, *args, **kwargs):
        super(MerchantMyProfileDetailAPIView, self).update(request, *args, **kwargs)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        if not self.request.user.merchant.dwolla_id:
            # if dwolla_id is not set yet
            create_dwolla_customer_merchant(instance)

        return Response(serializer.data)
