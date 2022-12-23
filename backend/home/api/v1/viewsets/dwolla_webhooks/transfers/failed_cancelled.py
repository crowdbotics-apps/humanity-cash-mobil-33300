import munch

from celo_humanity.models import ACHTransaction
from home.api.v1.viewsets.dwolla_webhooks import logger
from home.clients.dwolla_api import DwollaClient
from home.helpers import send_notifications
from users.models import Notification


def transfer_cancelled_or_failed_listener(event, event_db):
    dwolla_client = DwollaClient()
    transfer = munch.munchify(dwolla_client.get_transaction(event_db.resourceId))
    if transfer.status in ['cancelled', 'failed']:
        try:
            ach_transaction = ACHTransaction.objects.filter(transaction_id=transfer.id).get()

            if transfer.status == 'cancelled':
                ach_transaction.status = ACHTransaction.Status.cancelled
            else:
                ach_transaction.status = ACHTransaction.Status.failed
            ach_transaction.save(update_fields=['status'])

            target = ach_transaction.profile.user
            if target:
                send_notifications([target],
                                   f'Transaction {ach_transaction.get_status_display()}',
                                   f'the transaction {ach_transaction.ach_id} has {ach_transaction.get_status_display()}',
                                   '',
                                   target,
                                   Notification.Types.TRANSACTION,
                                   ach_transaction=ach_transaction)

            if ach_transaction.type == ACHTransaction.Type.withdraw:
                profile = ach_transaction.profile
                if profile:
                    logger.info(f'transaction {transfer.id} ended on: {transfer.status}, re-minting coins to {profile}')
                    try:
                        profile.deposit(transfer.amount.value)
                        logger.info(f'minted {transfer.amount.value} for {profile} successful')
                    except:
                        logger.exception(
                            f'error re-minting {transfer.amount.value} coins to profile {profile}, fix transaction manually')
                else:
                    logger.warning(f'transfer {transfer.id}, customer {transfer.destination.href} not found')

        except ACHTransaction.DoesNotExist:
            logger.warning(f'transfer {transfer.id}, not found in humanity platform, ignoring [cancelled/failed webhook]')