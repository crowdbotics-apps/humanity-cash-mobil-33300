import logging
from django.contrib.auth import get_user_model
from rest_framework.generics import UpdateAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from home.api.v1.serializers import setup_profile_serializers
from home.clients.dwolla_api import DwollaClient
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
            try:
                dwolla_client = DwollaClient()
                dwolla_id = dwolla_client.create_customer(
                    {
                        "firstName": instance.first_name,
                        "lastName": instance.last_name,
                        "email": instance.email
                    }
                )
                # TODO: add additional fields
                instance.consumer.dwolla_id = dwolla_id
                instance.consumer.save()
            except Exception as e:
                logger.exception('Dwolla Error: {}'.format(e))

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
            try:
                dwolla_client = DwollaClient()
                dwolla_id = dwolla_client.create_customer(
                    {
                        "firstName": instance.owner_first_name,
                        "lastName": instance.owner_last_name,
                        "email": instance.user.email,
                        "businessName": instance.business_name
                    }
                )
                # TODO: add additional fields
                instance.dwolla_id = dwolla_id
                instance.save()
            except Exception as e:
                logger.exception('Dwolla Error: {}'.format(e))

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


class MerchantMyProfileDetailAPIView(AuthenticatedAPIView, RetrieveUpdateAPIView):
    """
    Endpoint to view and edit Merchant Profile
    """
    serializer_class = setup_profile_serializers.MerchantMyProfileSerializer
    queryset = Merchant.objects.all()
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user.merchant
