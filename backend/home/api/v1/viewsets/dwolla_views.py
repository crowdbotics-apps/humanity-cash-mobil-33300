import logging
from rest_framework import status
from rest_framework.response import Response

from home.clients.dwolla_api import DwollaClient
from home.helpers import AuthenticatedAPIView

logger = logging.getLogger('django')


class CreateIavTokenView(AuthenticatedAPIView):

    def post(self, request):
        user = self.request.user
        user_type = self.request.data.get('user_type')  # consumer or merchant

        if user_type == 'consumer':
            if user.consumer.dwolla_id:
                dwolla_id = user.consumer.dwolla_id
            else:
                return Response({"error": "Consumer has no dwolla_id"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if user.merchant.dwolla_id:
                dwolla_id = user.merchant.dwolla_id
            else:
                return Response({"error": "Merchant has no dwolla_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dwolla_client = DwollaClient()
            iav_token = dwolla_client.get_iav_token(dwolla_id)

            return Response({"iav_token": iav_token}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception('Dwolla Error: {}'.format(e))
            return Response({"error": "Cannot get iav_token from Dwolla"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
