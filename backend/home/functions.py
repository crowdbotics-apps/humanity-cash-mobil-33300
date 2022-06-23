from rest_framework import status
from rest_framework.response import Response


def get_dwolla_id_request(user, request):
    user_type = request.data.get('user_type')  # consumer or merchant

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
