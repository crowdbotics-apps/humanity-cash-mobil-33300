import logging
from rest_framework import status
from rest_framework.response import Response

from home.clients.dwolla_api import DwollaClient

logger = logging.getLogger('django')


def get_dwolla_id_request(user, request):
    user_type = request.data.get('user_type')  # consumer or merchant

    if user_type == 'consumer' and hasattr(user, 'consumer'):
        if user.consumer.dwolla_id:
            dwolla_id = user.consumer.dwolla_id
            return {"dwolla_id": dwolla_id, "error": None, "response": None}
        else:
            try:
                create_dwolla_customer_consumer(user)
                dwolla_id = user.consumer.dwolla_id
                return {"dwolla_id": dwolla_id, "error": None, "response": None}
            except:
                return {"dwolla_id": None, "error": True, "response": Response({"error": "Consumer has no dwolla_id"},
                                                                               status=status.HTTP_400_BAD_REQUEST)}
    elif user_type == 'merchant' and hasattr(user, 'merchant'):
        if user.merchant.dwolla_id:
            dwolla_id = user.merchant.dwolla_id
            return {"dwolla_id": dwolla_id, "error": None, "response": None}
        else:
            try:
                create_dwolla_customer_merchant(user.merchant)
                dwolla_id = user.merchant.dwolla_id
                return {"dwolla_id": dwolla_id, "error": None, "response": None}
            except:
                return {"dwolla_id": None, "error": True, "response": Response({"error": "Merchant has no dwolla_id"}, status=status.HTTP_400_BAD_REQUEST)}
    return {"dwolla_id": None, "error": True,
            "response": Response({"error": "User has no dwolla_id"}, status=status.HTTP_400_BAD_REQUEST)}


def get_dwolla_id_request_user_type(user, user_type):
    if user_type == 'consumer' and hasattr(user, 'consumer'):
        if user.consumer.dwolla_id:
            dwolla_id = user.consumer.dwolla_id
            return {"dwolla_id": dwolla_id, "error": None, "response": None}
        return {"dwolla_id": None, "error": True, "response": Response({"error": "Consumer has no dwolla_id"}, status=status.HTTP_400_BAD_REQUEST)}
    elif user_type == 'merchant' and hasattr(user, 'merchant'):
        if user.merchant.dwolla_id:
            dwolla_id = user.merchant.dwolla_id
            return {"dwolla_id": dwolla_id, "error": None, "response": None}
        return {"dwolla_id": None, "error": True, "response": Response({"error": "Merchant has no dwolla_id"}, status=status.HTTP_400_BAD_REQUEST)}
    return {"dwolla_id": None, "error": True,
            "response": Response({"error": "User has no dwolla_id"}, status=status.HTTP_400_BAD_REQUEST)}


def create_dwolla_customer_consumer(instance):
    try:
        dwolla_client = DwollaClient()
        if instance.first_name and instance.last_name and instance.email:

            dwolla_id = dwolla_client.create_customer(
                {
                    "firstName": instance.first_name,
                    "lastName": instance.last_name,
                    "email": instance.email + '_consumer'
                }
            )
            # TODO: add additional fields
            # TODO: change if email for owner is added
            instance.consumer.dwolla_id = dwolla_id
            instance.consumer.save()
    except Exception as e:
        logger.exception('Dwolla Error: {}'.format(e))


def create_dwolla_customer_merchant(instance):
    try:
        dwolla_client = DwollaClient()
        if instance.owner_first_name and instance.owner_last_name and instance.user.email and instance.business_name:
            dwolla_id = dwolla_client.create_customer(
                {
                    "firstName": instance.owner_first_name,
                    "lastName": instance.owner_last_name,
                    "email": instance.user.email + '_merchant',
                    "businessName": instance.business_name
                }
            )
            # TODO: add additional fields
            # TODO: change if email for owner is added
            instance.dwolla_id = dwolla_id
            instance.save()
    except Exception as e:
        logger.exception('Dwolla Error: {}'.format(e))


def deactivate_dwolla_customer(dwolla_id):
    try:
        dwolla_client = DwollaClient()
        if dwolla_id:
            dwolla_client.deactivate_client(dwolla_id)

    except Exception as e:
        logger.exception('Dwolla Error: {}'.format(e))
