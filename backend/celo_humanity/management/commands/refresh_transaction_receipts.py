import traceback

from django.core.management import BaseCommand

from celo_humanity.models import Transaction

class Command(BaseCommand):

    def handle(self, *args, **options):
        self.style.INFO = self.style.HTTP_NOT_MODIFIED  # sugar
        self.style.MAGENTA = self.style.HTTP_SERVER_ERROR  # sugar

        self.stdout.write(self.style.INFO('refreshing transaction receipts'))

        try:
            refreshed = len([t.get_receipt(timeout=1) for t in Transaction.objects.all()])

            self.stdout.write(self.style.SUCCESS(f'Refreshed {refreshed} transaction receipts from the blockchain!'))
        except:
            self.stdout.write(self.style.WARNING(f'An error ocurred while refreshing transaction receipts from the blockchain!'))
            traceback.print_exc()

        print()
        self.stdout.write(self.style.SUCCESS(f"Refresh done!"))
