import munch
from django.utils.timezone import now

from celo_humanity.models import ACHTransaction
from home.api.v1.viewsets.dwolla_webhooks import get_profile_for_href, logger
from home.clients.dwolla_api import DwollaClient
from home.helpers import send_notifications
from users.models import Notification


def transfer_completed_listener(event, event_db):
    dwolla_client = DwollaClient()
    transfer = munch.munchify(dwolla_client.get_transaction(event_db.resourceId))

    if transfer.status == 'processed':
        ach_transaction = ACHTransaction.objects.filter(transaction_id=transfer.id).first()
        if ach_transaction:
            ach_transaction.status = ACHTransaction.Status.processed
            ach_transaction.confirmed_at = now()
            ach_transaction.save(update_fields=['status', 'confirmed_at'])

            if ach_transaction.consumer:
                target = ach_transaction.consumer.user
            else:
                target = ach_transaction.merchant.user
            if target:
                send_notifications([target],
                                   'Transaction cofirmed',
                                   f'the transaction {ach_transaction.ach_id} was confirmed',
                                   '',
                                   target,
                                   Notification.Types.TRANSACTION,
                                   ach_transaction=ach_transaction)


        if transfer['_links'].source['resource-type'] == 'customer':
            have_profile, profile = get_profile_for_href(transfer, transfer['_links'].source.href)
            if have_profile:
                logger.info(f'transaction {transfer.id} processed, starting minting process')
                try:
                    profile.deposit(transfer.amount.value)
                    logger.info(f'minted {transfer.amount.value} for {profile} successfully')
                except:
                    logger.exception(
                        f'error minting {transfer.amount.value} for {profile}, fix transaction manually')

        elif transfer['_links'].destination['resource-type'] == 'customer':
            have_profile, profile = get_profile_for_href(transfer, transfer['_links'].destination.href)
            if have_profile:
                logger.info(f'transaction {transfer.id} processed, burning done on creation, doing nothing')
            else:
                logger.warning(f'transfer {transfer.id}, customer {transfer["_links"].destination.href} not found')
        else:
            logger.warning(f'transfer {transfer.id}, unknown source and destination, ignoring')
