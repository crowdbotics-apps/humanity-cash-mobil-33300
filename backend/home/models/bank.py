from decimal import Decimal
from operator import itemgetter

from django.db import models
from django.db.models import Sum, Q
from rest_framework.exceptions import ValidationError

from celo_humanity.models import ACHTransaction


class NoBankAccountException(ValidationError):
    default_detail = 'No bank account eligible for transaction, please contact system administrator'


class BankAccount(models.Model):
    name = models.CharField(max_length=128)
    bank_name = models.CharField(max_length=128)
    description = models.CharField(max_length=512)
    bank_order = models.IntegerField(null=False, default=1)

    dwolla_account = models.CharField(max_length=200, null=True)
    enabled_credit = models.BooleanField(default=True, null=False)
    enabled_debit = models.BooleanField(default=True, null=False)
    weigth_adjustment_credits = models.FloatField(default=1.0, null=False)
    weigth_adjustment_debits = models.FloatField(default=1.0, null=False)
    initial_balance = models.DecimalField(null=True, decimal_places=2, max_digits=14)

    @property
    def detailed_credits_and_debits(self):
        credits_pending = Sum('ach_transactions__amount',
                              filter=Q(ach_transactions__type=ACHTransaction.Type.deposit,
                                       ach_transactions__status=ACHTransaction.Status.pending))
        credits_settled = Sum('ach_transactions__amount',
                              filter=Q(ach_transactions__type=ACHTransaction.Type.deposit,
                                       ach_transactions__status=ACHTransaction.Status.processed))

        debits_pending = Sum('ach_transactions__amount',
                             filter=Q(ach_transactions__type=ACHTransaction.Type.withdraw,
                                      ach_transactions__status=ACHTransaction.Status.pending))
        debits_settled = Sum('ach_transactions__amount',
                             filter=Q(ach_transactions__type=ACHTransaction.Type.withdraw,
                                      ach_transactions__status=ACHTransaction.Status.processed))

        account_balance = BankAccount.objects.filter(pk=self.id).annotate(
            credits_pending=credits_pending,
            credits_settled=credits_settled,
            debits_pending=debits_pending,
            debits_settled=debits_settled,
        ).get()
        return (
            account_balance.credits_pending or 0,
            account_balance.credits_settled or 0,
            account_balance.debits_pending or 0,
            account_balance.debits_settled or 0,
        )

    @property
    def credits_and_debits(self):
        validstatus = Q(ach_transactions__status__in=[ACHTransaction.Status.pending,
                                                      ACHTransaction.Status.processed])
        credits = Sum('ach_transactions__amount',
                      filter=Q(ach_transactions__type=ACHTransaction.Type.deposit) & validstatus)
        debits = Sum('ach_transactions__amount',
                     filter=Q(ach_transactions__type=ACHTransaction.Type.withdraw) & validstatus)
        account_balance = BankAccount.objects.filter(pk=self.id).annotate(credits=credits, debits=debits).get()
        return account_balance.credits or 0, account_balance.debits or 0

    @property
    def current_balance(self):
        credits, debits = self.credits_and_debits
        return self.initial_balance + credits - debits


def choose_bank_account_for_transaction(credit=True):
    accounts = BankAccount.objects
    accounts = accounts.filter(enabled_credit=True) if credit else accounts.filter(enabled_debit=True)

    if not accounts.exists():
        raise NoBankAccountException()
    balances = sorted([(
        # multiply the balance for the adjustment factor, to prioritize certain accounts over others
        bank.current_balance * Decimal(bank.weigth_adjustment_credits if credit else bank.weigth_adjustment_debits),
        bank
    ) for bank in accounts], key=itemgetter(0))

    # for credit choose the lower balance, for debits, choose the higher balance
    return balances[0][1] if credit else balances[-1][1]
