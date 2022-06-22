import logging

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response

from home.clients.dwolla_api import DwollaClient
from home.functions import get_dwolla_id_request
from home.helpers import AuthenticatedAPIView
from users.models import Merchant, Consumer

User = get_user_model()
logger = logging.getLogger('django')


class CreateIavTokenView(AuthenticatedAPIView):

    def post(self, request):
        dwolla_id = get_dwolla_id_request(self.request.user, self.request)

        if isinstance(dwolla_id, Response):  # if errors
            return dwolla_id

        try:
            dwolla_client = DwollaClient()
            iav_token = dwolla_client.get_iav_token(dwolla_id)

            return Response({"iav_token": iav_token}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception('Dwolla Error: {}'.format(e))
            return Response({"error": "Cannot get iav_token from Dwolla"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class DwollaFundingSourcesByCustomerView(AuthenticatedAPIView):

    def get(self, request, id):
        user = User.objects.get(id=id)
        dwolla_id = get_dwolla_id_request(user, self.request)

        if isinstance(dwolla_id, Response):
            return dwolla_id

        try:
            dwolla_client = DwollaClient()
            funding_sources = dwolla_client.get_funding_sources_by_customer(dwolla_id)

            # only return verified funding sources
            verified_funding_sources = []
            for fs in funding_sources:
                fs_unverified = fs['status'] == 'unverified'
                fs_isbank = fs['type'] == 'bank'

                if not (fs_isbank and fs_unverified):
                    verified_funding_sources.append(fs)

            return Response(data=verified_funding_sources, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception('Dwolla Error: {}'.format(e))
            return Response({"error": "Cannot get funding sources for Customer from Dwolla"},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)


class DwollaMyFundingSourcesView(AuthenticatedAPIView):

    def get(self, request):
        dwolla_id = get_dwolla_id_request(self.request.user, self.request)

        if isinstance(dwolla_id, Response):
            return dwolla_id

        try:
            dwolla_client = DwollaClient()
            funding_sources = dwolla_client.get_funding_sources_by_customer(dwolla_id)

            # only return verified funding sources
            verified_funding_sources = []
            for fs in funding_sources:
                fs_unverified = fs['status'] == 'unverified'
                fs_isbank = fs['type'] == 'bank'

                if not (fs_isbank and fs_unverified):
                    verified_funding_sources.append(fs)

            return Response(data=verified_funding_sources, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception('Dwolla Error: {}'.format(e))
            return Response({"error": "Cannot get funding sources for Customer from Dwolla"},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)
