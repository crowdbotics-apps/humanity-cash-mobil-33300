import munch

from celo_humanity.models import ACHTransaction
from home.api.v1.viewsets.dwolla_webhooks import logger
from home.clients.dwolla_api import DwollaClient


def transfer_created_listener(event, event_db):
    dwolla_client = DwollaClient()
    transaction = dwolla_client.get_transaction(event_db.resourceId)
    transfer = munch.munchify(transaction)

    try:
        ach_transaction = ACHTransaction.objects.get(transaction_id=transfer.id)

        # TODO nothing
    except ACHTransaction.DoesNotExist:
        logger.warning(f'transfer {transfer.id}, not found in humanity platform, ignoring [transacion created]')
