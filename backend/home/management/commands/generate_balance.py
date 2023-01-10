from django.core.management import BaseCommand

from home.models.balances import create_system_balance


class Command(BaseCommand):

    def handle(self, *args, **options):
        balance = create_system_balance()
        print(f'system balance generated for {balance.created}')
