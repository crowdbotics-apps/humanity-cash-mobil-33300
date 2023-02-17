import hashlib
import hmac
import logging

from django.conf import settings
from rest_framework.permissions import BasePermission

from users.models import Consumer, Merchant

logger = logging.getLogger('dwolla')


class DwollaSignatureIsValid(BasePermission):

    def has_permission(self, request, view):
        secret = settings.DWOLLA_SANDBOX_WEBHOOK_SECRET if settings.DWOLLA_ENVIRONMENT == 'sandbox' else \
            settings.DWOLLA_PRODUCTION_WEBHOOK_SECRET
        # Check signature
        hmacsig = hmac.new(secret.encode(), request.body, hashlib.sha256).hexdigest()
        return hmacsig == request.headers.get('x-request-signature-sha-256', 'invalid')


