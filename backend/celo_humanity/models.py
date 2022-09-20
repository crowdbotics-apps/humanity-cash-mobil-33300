
from django.db import models


# Create your models here.
from celo_humanity.web3helpers import get_contract, ContractProxy


class Contract(models.Model):
    contract_name = models.CharField(max_length=255, null=False, blank=False)
    description = models.CharField(max_length=255, null=False, blank=False)
    deployed_address = models.CharField(max_length=255, null=False, blank=False)
    version = models.CharField(max_length=255, null=False)
    metadata = models.JSONField(null=False, blank=False)
    active = models.BooleanField(default=False, null=False)

    proxy_holder = None

    def __init__(self, *args, **kwargs):
        super(Contract, self).__init__(*args, **kwargs)
        if self.deployed_address and self.abi:
            self.proxy_holder = ContractProxy(get_contract(self.deployed_address, self.abi))

    @property
    def abi(self):
        return self.metadata['output']['abi']

    @property
    def proxy(self):
        return self.proxy_holder

    def __str__(self):
        return f'Contract {self.contract_name} at {self.deployed_address}'


class Transaction(models.Model):
    class Type(models.TextChoices):
        withdraw = 'Withdraw'
        deposit = 'Deposit'
        transfer = 'Transfer'
        new_wallet = 'New wallet'

    contract = models.ForeignKey(Contract, null=True, on_delete=models.SET_NULL)
    transaction_id = models.CharField(max_length=255, null=False, blank=False, db_index=True)
    method_or_memo = models.CharField(max_length=255, null=False, blank=True)
    type = models.CharField(max_length=255, null=False, blank=True, choices=Type.choices)
    friendly_memo = models.CharField(max_length=255, null=False, blank=True)
    receipt_id = models.CharField(max_length=255, null=True, blank=False)
    receipt = models.TextField(null=True)
    created = models.DateTimeField(auto_now=True)
    amount = models.DecimalField(null=True, decimal_places=2, max_digits=14)

    crypto_wallet_id = models.CharField(max_length=128, blank=False, null=True)
    counterpart_crypto_wallet_id = models.CharField(max_length=128, blank=False, null=True)

    consumer = models.ForeignKey('users.Consumer', null=True, on_delete=models.SET_NULL, related_name='transactions')
    merchant = models.ForeignKey('users.Merchant', null=True, on_delete=models.SET_NULL, related_name='transactions')

    counterpart_consumer = models.ForeignKey('users.Consumer', null=True, on_delete=models.SET_NULL, related_name='counterpart_transactions')
    counterpart_merchant = models.ForeignKey('users.Merchant', null=True, on_delete=models.SET_NULL, related_name='counterpart_transactions')

    def __str__(self):
        return f'txn[ {self.transaction_id} ] ({self.method_or_memo})'

    @property
    def confirmations(self):
        from celo_humanity.humanity_contract_helpers import get_transaction_confirmations
        return get_transaction_confirmations(self.transaction_id)

    @property
    def profile(self):
        return self.consumer if self.consumer else self.merchant

    @profile.setter
    def profile(self, profile):
        self.consumer = profile if profile and profile.is_consumer else None
        self.merchant = profile if profile and profile.is_merchant else None

    @property
    def counterpart_profile(self):
        return self.counterpart_consumer if self.counterpart_consumer else self.counterpart_merchant

    @counterpart_profile.setter
    def counterpart_profile(self, profile):
        self.counterpart_consumer = profile if profile and profile.is_consumer else None
        self.counterpart_merchant = profile if profile and profile.is_merchant else None
