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



