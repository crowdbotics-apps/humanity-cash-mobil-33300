import munch
from dwollav2 import NotFoundError

from celo_humanity.humanity_contract_helpers import transfer_coin, get_humanity_userid
from celo_humanity.models import ACHTransaction
from home.api.v1.viewsets.dwolla_webhooks import get_profile_for_href, logger
from home.clients.dwolla_api import DwollaClient
from datetime import datetime

def transfer_created_listener(event, event_db):
    dwolla_client = DwollaClient()
    transaction = dwolla_client.get_transaction(event_db.resourceId)
    logger.warning(f'transfer {transaction}, unknown source and destination, ignoring')
    transfer = munch.munchify(transaction)

    source_founding_source = transaction["source-funding-source"]["href"].split('/')[-1]
    try:
        dwolla_client.get_funding_source_by_id(source_founding_source)
    except NotFoundError:
        logger.error(f"not found source {source_founding_source}")

    ach_transaction = ACHTransaction(transaction_id=transaction.id,
                                     amount=transaction.amount.value,
                                     status=ACHTransaction.Status.pending,
                                     ach_id=transaction.individualAchId,
                                     currency=transaction.amount.currency,
                                     created_at=datetime.strptime(transfer.created, '%Y-%m-%dT%H:%M:%S.%fZ'))
    if transfer.status == 'pending':

        if transfer['_links'].source['resource-type'] == 'customer':
            # transfers from customers only matters on proccessed status
            ach_transaction.type = ACHTransaction.Type.deposit
        elif transfer['_links'].source['resource-type'] == 'account':
            ach_transaction.type = ACHTransaction.Type.withdraw
        elif transfer['_links'].destination['resource-type'] == 'customer':
            have_profile, profile = get_profile_for_href(transfer, transfer['_links'].destination.href)
            if have_profile:
                if profile.is_consumer:
                    ach_transaction.consumer = profile
                else:
                    ach_transaction.merchant = profile
                logger.info(f'transaction {transfer.id} created, burning {transfer.amount.value} should be done for {profile}')
            else:
                logger.warning(f'transfer {transfer.id}, customer {transfer["_links"].destination.href} not found, ignoring')
        else:
            logger.warning(f'transfer {transfer.id}, unknown source and destination, ignoring')

        ach_transaction.save()

