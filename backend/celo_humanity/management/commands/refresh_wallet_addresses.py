import traceback

from django.core.management import BaseCommand

from celo_humanity.models import Transaction
from users.models import Consumer, Merchant


class Command(BaseCommand):

    def handle(self, *args, **options):
        self.style.INFO = self.style.HTTP_NOT_MODIFIED  # sugar
        self.style.MAGENTA = self.style.HTTP_SERVER_ERROR  # sugar

        self.stdout.write(self.style.INFO('refreshing user wallet addresses'))

        try:
            refreshed = len([c.get_wallet_address() for c in Consumer.objects.all() if c.crypto_wallet_id])

            self.stdout.write(self.style.SUCCESS(f'Refreshed {refreshed} consumer wallet addresses!'))

            refreshed = len([m.get_wallet_address() for m in Merchant.objects.all() if m.crypto_wallet_id])

            self.stdout.write(self.style.SUCCESS(f'Refreshed {refreshed} merchant wallet addresses!'))
        except:
            self.stdout.write(self.style.WARNING(f'An error ocurred while refreshing wallet addresses from the blockchain!'))
            traceback.print_exc()

        print()
        self.stdout.write(self.style.SUCCESS(f"Refresh done!"))
