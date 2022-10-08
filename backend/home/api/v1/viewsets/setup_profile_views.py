import logging
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.generics import UpdateAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from home.api.v1.cashier_permission import IsNotCashier
from home.api.v1.serializers import setup_profile_serializers
from home.clients.dwolla_api import DwollaClient
from home.functions import create_dwolla_customer_consumer, create_dwolla_customer_merchant
from home.helpers import AuthenticatedAPIView
from users.models import Merchant, NoMerchantProfileException, Consumer

User = get_user_model()
logger = logging.getLogger('django')


class SetupConsumerProfileFirstStepAPIView(AuthenticatedAPIView):

    def post(self, request):
        user = self.request.user
        data = request.data
        username = data.get('username')
        user_exists = User.objects.filter(username=username).exclude(id=user.id).first()
        if user_exists:
            return Response({'username': 'Username already registered'}, status=status.HTTP_400_BAD_REQUEST)
        profile_image = data.get('consumer_profile', None)
        consumer, _ = Consumer.objects.get_or_create(user=user)
        if profile_image:
            consumer.profile_picture = profile_image
            consumer.save()
        user.username = username
        user.save()
        return Response(status=status.HTTP_200_OK)


class SetupConsumerProfileSecondStepAPIView(AuthenticatedAPIView):

    def post(self, request):
        user = self.request.user
        data = request.data
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        return Response(status=status.HTTP_200_OK)


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

        if hasattr(self.request.user, 'consumer') and not self.request.user.consumer.dwolla_id:
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
        user = self.request.user
        user.get_merchant_data.new_wallet()


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
        user = self.request.user
        if not user.consumer.dwolla_id:
            # if dwolla_id is not set yet
            create_dwolla_customer_consumer(user)
        return user

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
        try:
            return self.request.user.merchant
        except ObjectDoesNotExist:
            return None


    def update(self, request, *args, **kwargs):
        super(MerchantMyProfileDetailAPIView, self).update(request, *args, **kwargs)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        if not self.request.user.merchant.dwolla_id:
            # if dwolla_id is not set yet
            create_dwolla_customer_merchant(instance)
        # serializer.save()
        return Response(serializer.initial_data)


class SetCashierModeView(AuthenticatedAPIView):

    def post(self, request, *args, **kwargs):
        request.session['cashier'] = True
        return Response(status=status.HTTP_200_OK)


# class CashierTestView(AuthenticatedAPIView):
#
#     def get(self, request, *args, **kwargs):
#         return Response(dict(cashier=request.session.get('cashier', False)), status=status.HTTP_200_OK)
#
# class NoCashierTestView(AuthenticatedAPIView):
#     permission_classes = [IsNotCashier]
#
#     def get(self, request, *args, **kwargs):
#         return Response(dict(cashier=request.session.get('cashier', False)), status=status.HTTP_200_OK)
