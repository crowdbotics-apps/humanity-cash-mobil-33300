from decimal import Decimal

from django.db import models, transaction
from django.db.models import Sum
from model_utils.models import TimeStampedModel

from celo_humanity.models import Transaction
from home.models.bank import BankAccount


class DatedSystemBalance(TimeStampedModel):
    tokens_minted = models.DecimalField(null=False, default=0, decimal_places=4, max_digits=12)
    tokens_burned = models.DecimalField(null=False, default=0, decimal_places=4, max_digits=12)

    comments = models.TextField(null=False, default='', blank=True)

    cached_balances = None

    def __init__(self, *args, cached_balances=None, **kwargs):
        self.cached_balances = cached_balances
        super().__init__(*args, **kwargs)

    @property
    def balances(self):
        return self.cached_balances if self.cached_balances else self.bank_balances.all()


class DatedSystemBalanceBankBalances(TimeStampedModel):
    balance = models.ForeignKey(DatedSystemBalance, null=False, on_delete=models.CASCADE, related_name='bank_balances')
    bank_account = models.ForeignKey('home.BankAccount', null=False, on_delete=models.PROTECT,
                                     related_name='dated_balances')

    credits_pending = models.DecimalField(null=False, default=0, decimal_places=2, max_digits=8)
    credits_settled = models.DecimalField(null=False, default=0, decimal_places=2, max_digits=8)
    debits_pending = models.DecimalField(null=False, default=0, decimal_places=2, max_digits=8)
    debits_settled = models.DecimalField(null=False, default=0, decimal_places=2, max_digits=8)


def create_system_balance():
    with transaction.atomic():
        tokens_minted = Transaction.objects.filter(type=Transaction.Type.deposit).aggregate(
            Sum('amount'))['amount__sum'] or Decimal(0.0)
        tokens_burned = Transaction.objects.filter(type=Transaction.Type.withdraw).aggregate(
            Sum('amount'))['amount__sum'] or Decimal(0.0)

        balance = DatedSystemBalance.objects.create(
            tokens_minted=tokens_minted,
            tokens_burned=tokens_burned,
        )
        for account in BankAccount.objects.all():
            credits_pending, credits_settled, debits_pending, debits_settled = account.detailed_credits_and_debits
            DatedSystemBalanceBankBalances.objects.create(
                balance=balance,
                bank_account=account,
                credits_pending=credits_pending,
                credits_settled=credits_settled,
                debits_pending=debits_pending,
                debits_settled=debits_settled,
            )
        return balance


def get_current_system_balance():
    tokens_minted = Transaction.objects.filter(type=Transaction.Type.deposit).aggregate(
        Sum('amount'))['amount__sum'] or Decimal(0.0)
    tokens_burned = Transaction.objects.filter(type=Transaction.Type.withdraw).aggregate(
        Sum('amount'))['amount__sum'] or Decimal(0.0)

    cached = []
    for account in BankAccount.objects.all():
        credits_pending, credits_settled, debits_pending, debits_settled = account.detailed_credits_and_debits
        cached.append(DatedSystemBalanceBankBalances(
            bank_account=account,
            credits_pending=credits_pending,
            credits_settled=credits_settled,
            debits_pending=debits_pending,
            debits_settled=debits_settled,
        ))

    balance = DatedSystemBalance(
        tokens_minted=tokens_minted,
        tokens_burned=tokens_burned,
        cached_balances=cached,
    )

    return balance
