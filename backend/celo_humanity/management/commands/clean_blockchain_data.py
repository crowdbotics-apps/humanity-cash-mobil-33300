import json
import os
import tempfile
import time
from datetime import datetime

import traceback

from django.core.management import BaseCommand

from celo_humanity.models import Transaction
from users.models import Consumer, Merchant


class Command(BaseCommand):

    def handle(self, *args, **options):
        self.style.INFO = self.style.HTTP_NOT_MODIFIED  # sugar
        self.style.MAGENTA = self.style.HTTP_SERVER_ERROR  # sugar

        self.stdout.write(self.style.INFO('cleaning transactions'))

        try:
            deleted = len([t.delete() for t in Transaction.objects.all()])

            self.stdout.write(self.style.SUCCESS(f'Deleted {deleted} transactions from the database!'))
        except:
            self.stdout.write(self.style.WARNING(f'An error ocurred while deleting transactions from the database!'))
            traceback.print_exc()

        self.stdout.write(self.style.INFO('cleaning wallets from the database'))

        try:
            consumers = Consumer.objects.all()
            for c in consumers:
                c.crypto_wallet_id = None
                c.save()

            self.stdout.write(self.style.SUCCESS(f"Erased {len(consumers)} customer's wallet from the database!"))
        except:
            self.stdout.write(self.style.WARNING(f'An error ocurred while deleting transactions from the database!'))
            traceback.print_exc()

        try:
            merchants = Merchant.objects.all()
            for c in merchants:
                c.crypto_wallet_id = None
                c.save()

            self.stdout.write(self.style.SUCCESS(f"Erased {len(merchants)} customer's wallet from the database!"))
        except:
            self.stdout.write(self.style.WARNING(f'An error ocurred while deleting transactions from the database!'))
            traceback.print_exc()

        print()
        self.stdout.write(self.style.SUCCESS(f"Cleaning done!"))