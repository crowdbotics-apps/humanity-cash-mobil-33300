import munch

from celo_humanity.humanity_contract_helpers import get_humanity_userid, withdraw_coin
from home.api.v1.viewsets.dwolla_webhooks import get_profile_for_href, logger
from home.clients.dwolla_api import DwollaClient


def transfer_completed_listener(event, event_db):
    dwolla_client = DwollaClient()
    transfer = munch.munchify(dwolla_client.get_transaction(event_db.resourceId))
    if transfer.status == 'processed':
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
                logger.warning(f'transfer {transfer.id}, customer {transfer.destination.href} not found')
        else:
            logger.warning(f'transfer {transfer.id}, unknown source and destination, ignoring')
