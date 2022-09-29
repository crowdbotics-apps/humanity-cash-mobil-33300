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
        return hmacsig == request.headers['x-request-signature-sha-256']


def get_profile_for_href(transfer, href):
    id_customer = href.split('/')[-1]
    customer = Consumer.objects.filter(dwolla_id=id_customer).first()
    merchant = Merchant.objects.filter(dwolla_id=id_customer).first()
    if customer and merchant:
        logger.error(
            f'Have both customer id {customer.id} and merchant id {merchant.id} for the same dwolla id {id_customer}, check database and run transaction manually, ignoring transfer {transfer.id}')
        return False, None

    if not customer and not merchant:
        logger.error(
            f'Didnt find customer or merchant for dwolla id {id_customer}, check database and run transaction manually, ignoring transfer {transfer.id}')
        return False, None

    return True, customer if customer else merchant
