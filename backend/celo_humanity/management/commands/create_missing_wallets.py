import traceback

from django.core.management import BaseCommand

from users.models import Consumer, Merchant
from celo_humanity.humanity_contract_helpers import get_wallet
from base import configs

class Command(BaseCommand):

    def handle(self, *args, **options):
        self.style.INFO = self.style.HTTP_NOT_MODIFIED  # sugar
        self.style.MAGENTA = self.style.HTTP_SERVER_ERROR  # sugar

        try:
            s = 0
            for c in Consumer.objects.all():
                if c.crypto_wallet_id is None:
                    try:
                        c.new_wallet()
                        s+=1
                    except:
                        print('Error creating wallet of consumer ', c)

            self.stdout.write(self.style.SUCCESS(f"Created {s} customer's wallets!"))
        except:
            self.stdout.write(self.style.WARNING(f'An error ocurred while creating wallets from the blockchain!'))
            traceback.print_exc()

        try:
            s = 0
            for c in Merchant.objects.all():
                if c.crypto_wallet_id is None:
                    try:
                        c.new_wallet()
                        s+=1
                    except:
                        print('Error creating wallet of merchant ', c)

            self.stdout.write(self.style.SUCCESS(f"Created {s} merchants wallets!"))
        except:
            self.stdout.write(self.style.WARNING(f'An error ocurred while creating wallets from the blockchain!'))
            traceback.print_exc()

        get_wallet(configs.RESERVE_WALLET_UID, create=True)
        get_wallet(configs.POSITIVE_ADJUSTMENT_WALLET_UID, create=True)
        get_wallet(configs.NEGATIVE_ADJUSTMENT_WALLET_UID, create=True)
        self.stdout.write(self.style.WARNING(f'Compliance wallets created!'))
        print()
        self.stdout.write(self.style.SUCCESS(f"Creating done!"))