from django.apps import AppConfig


class CeloHumanityConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'celo_humanity'
    verbose_name = "Celo Humanity"

    def ready(self):
        ...
        # from celo_humanity.dwolla_webhooks import listen_dwolla_trns
        # listen_dwolla_trns()
