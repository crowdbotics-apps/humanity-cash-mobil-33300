import munch

from celo_humanity.humanity_contract_helpers import transfer_coin, get_humanity_userid
from home.api.v1.viewsets.dwolla_webhooks import get_profile_for_href, logger
from home.clients.dwolla_api import DwollaClient


def transfer_created_listener(event, event_db):
    dwolla_client = DwollaClient()
    transfer = munch.munchify(dwolla_client.get_transaction(event_db.resourceId))
    if transfer.status == 'pending':
        if transfer['_links'].source['resource-type'] == 'customer':
            # transfers from customers only matters on proccessed status
            pass

        elif transfer['_links'].destination['resource-type'] == 'customer':
            have_profile, profile = get_profile_for_href(transfer, transfer['_links'].destination.href)
            if have_profile:
                logger.info(f'transaction {transfer.id} created, burning {transfer.amount.value} while transfer '
                            f'completes')
                try:
                    profile.withdraw(transfer.amount.value)
                    logger.info(
                        f'burning {transfer.amount.value} from {profile} succesfull')
                except:
                    logger.exception(f'error burning {transfer.amount.value} from profile {profile}, fix transaction '
                                     f'manually')
            else:
                logger.warning(f'transfer {transfer.id}, customer {transfer.destination.href} not found, ignoring')
        else:
            logger.warning(f'transfer {transfer.id}, unknown source and destination, ignoring')
