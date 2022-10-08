import munch

from celo_humanity.humanity_contract_helpers import transfer_coin, get_humanity_userid
from celo_humanity.models import ACHTransaction
from home.api.v1.viewsets.dwolla_webhooks import get_profile_for_href, logger
from home.clients.dwolla_api import DwollaClient


def transfer_cancelled_or_failed_listener(event, event_db):
    dwolla_client = DwollaClient()
    transfer = munch.munchify(dwolla_client.get_transaction(event_db.resourceId))
    if transfer.status in ['cancelled', 'failed']:
        ach_trasaction = ACHTransaction.objects.filter(transaction_id=transfer.id).first()
        if ach_trasaction:
            if transfer.status == 'cancelled':
                ach_trasaction.status = ACHTransaction.Status.cancelled
            else:
                ach_trasaction.status = ACHTransaction.Status.failed
            ach_trasaction.save(update_fields=['status'])

        if transfer['_links'].source['resource-type'] == 'customer':
            # transfers from customers only matters on proccessed status
            pass

        elif transfer['_links'].destination['resource-type'] == 'customer':
            have_profile, profile = get_profile_for_href(transfer, transfer['_links'].destination.href)
            if have_profile:
                logger.info(f'transaction {transfer.id} ended on: {transfer.status}, re-minting coins to {profile}')
                try:
                    profile.deposit(transfer.amount.value)
                    logger.info(f'minted {transfer.amount.value} for {profile} successful')
                except:
                    logger.exception(
                        f'error sending {transfer.amount.value} to profile {profile} from funds saved in humanity cash for pending transaction, fix transaction manually')
            else:
                logger.warning(f'transfer {transfer.id}, customer {transfer.destination.href} not found')
        else:
            logger.warning(f'transfer {transfer.id}, unknown source and destination, ignoring')
