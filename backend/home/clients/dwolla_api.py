import logging
import dwollav2

from django.conf import settings

logger = logging.getLogger('django')


class DwollaClient:
    def __init__(self):
        logger.info('Starting dwolla client')
        self.app_token = None
        if settings.DWOLLA_ENVIRONMENT == 'sandbox':
            logger.info('DWOLLA TEST MODE')
            self.client = dwollav2.Client(
                environment='sandbox',
                key=settings.DWOLLA_SANDBOX_APP_KEY,
                secret=settings.DWOLLA_SANDBOX_APP_SECRET
            )
        else:
            logger.info('DWOLLA PRODUCTION MODE')
            self.client = dwollav2.Client(
                environment='production',
                key=settings.DWOLLA_PRODUCTION_APP_KEY,
                secret=settings.DWOLLA_PRODUCTION_APP_SECRET
            )
        self.get_app_token()

    def get_app_token(self):
        self.app_token = self.client.Auth.client()

    def create_customer(self, request_body):
        logger.info('create_customer')
        customer = self.app_token.post('customers', request_body)
        return customer.headers['location'].split('/')[-1]

    def get_base_url(self):
        base_url = dwollav2.Client.ENVIRONMENTS.get(settings.DWOLLA_ENVIRONMENT).get('api_url')
        return base_url

    def get_iav_token(self, dwolla_customer_id):
        customer_url = '{}/customers/{}/iav-token'.format(self.get_base_url(), dwolla_customer_id)
        return self.app_token.post(customer_url).body.get('token')

    def get_funding_sources_by_customer(self, dwolla_customer_id):
        funding_url = '{}/customers/{}/funding-sources?removed=false'.format(self.get_base_url(), dwolla_customer_id)
        funding_sources = self.app_token.get(funding_url).body.get('_embedded').get('funding-sources')
        return funding_sources

    def get_funding_source_by_id(self, funding_source_id):
        funding_url = 'funding-sources/{}/'.format(self.get_base_url(), funding_source_id)
        funding_source = self.app_token.get(funding_url)
        return funding_source

    def get_dwolla_master_account_id(self):
        root = self.app_token(self.get_base_url())
        master_account_id = root.body.get['_links']['account']['href'].split('/')[-1]
        return master_account_id

    def get_dwolla_master_account_funding_sources(self):
        funding_url = 'accounts/{}/funding-sources?removed=false'.format(
            self.get_base_url(), self.get_dwolla_master_account_id())
        funding_sources = self.app_token.get(funding_url).body.get('_embedded').get('funding-sources')
        return funding_sources
