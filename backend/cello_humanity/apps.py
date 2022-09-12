from django.apps import AppConfig

from cello_humanity.dwolla_webhooks import listen_dwolla_trns


class CelloHumanityConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cello_humanity'


    def ready(self):
        ...
        # listen_dwolla_trns()
