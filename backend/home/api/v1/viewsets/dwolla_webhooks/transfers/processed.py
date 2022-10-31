import munch
from django.utils.timezone import now

from celo_humanity.models import ACHTransaction
from home.api.v1.viewsets.dwolla_webhooks import logger
from home.clients.dwolla_api import DwollaClient
from home.helpers import send_notifications
from users.models import Notification


def transfer_completed_listener(event, event_db):
    dwolla_client = DwollaClient()
    transfer = munch.munchify(dwolla_client.get_transaction(event_db.resourceId))

    if transfer.status == 'processed':
        try:
            ach_transaction = ACHTransaction.objects.get(transaction_id=transfer.id)

            ach_transaction.status = ACHTransaction.Status.processed
            ach_transaction.confirmed_at = now()
            ach_transaction.save(update_fields=['status', 'confirmed_at'])

            target = ach_transaction.profile.user
            if target:
                send_notifications([target],
                                   'Transaction confirmed',
                                   f'the transaction {ach_transaction.ach_id} was confirmed',
                                   '',
                                   target,
                                   Notification.Types.TRANSACTION,
                                   ach_transaction=ach_transaction)

            if ach_transaction.type == ACHTransaction.Type.deposit:
                profile = ach_transaction.profile
                if profile:
                    logger.info(f'transaction {transfer.id} processed, starting minting process')
                    try:
                        profile.deposit(transfer.amount.value)
                        logger.info(f'minted {transfer.amount.value} for {profile} successfully')
                    except:
                        logger.exception(
                            f'error minting {transfer.amount.value} for {profile}, fix transaction manually')
                else:
                    logger.exception(
                        f'error minting {transfer.amount.value} for {profile}, fix transaction manually')

            elif ach_transaction.type == ACHTransaction.Type.withdraw:
                profile = ach_transaction.profile
                if profile:
                    logger.info(f'transaction {transfer.id} processed, burning done on creation, doing nothing')
                else:
                    logger.warning(f'transfer {transfer.id}, customer {transfer["_links"].destination.href} not found')
            else:
                logger.warning(f'transfer {transfer.id}, unknown transaction type, ignoring')
        except ACHTransaction.DoesNotExist:
            logger.warning(f'transfer {transfer.id}, not found in humanity platform, ignoring [processed webhook]')