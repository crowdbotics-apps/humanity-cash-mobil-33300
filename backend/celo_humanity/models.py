import json
import logging
from datetime import datetime

from django.conf import settings
from django.db import models
from rest_framework.exceptions import ValidationError
from web3._utils.encoding import to_json
from web3.exceptions import TimeExhausted

from base import configs
from celo_humanity.web3helpers import get_contract, ContractProxy, is_json, hextring_object_hook, get_txn_receipt, \
    MyWeb3JsonEncoder
from home.utils import flat_map
from descriptors import cachedclassproperty

# Create your models here.


class Account(models.Model):
    name = models.CharField(max_length=70, unique=True)
    dwolla_id = models.CharField(max_length=255, db_index=True)
    bank_name = models.CharField(max_length=70, unique=True)
    created = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name


class Contract(models.Model):
    contract_name = models.CharField(max_length=255, null=False, blank=False)
    description = models.CharField(max_length=255, null=False, blank=False)
    deployed_address = models.CharField(max_length=255, null=False, blank=False)
    version = models.CharField(max_length=255, null=False)
    metadata = models.JSONField(null=False, blank=False)
    active = models.BooleanField(default=False, null=False)

    proxy_holder = None

    class Meta:
        ordering = ['-id']

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
    events_in_receipt = models.JSONField(null=True)
    created = models.DateTimeField(auto_now=True)
    amount = models.DecimalField(null=True, decimal_places=2, max_digits=14)
    admin_wallet_action = models.BooleanField(null=False, default=False)

    crypto_wallet_id = models.CharField(max_length=128, blank=False, null=True)
    counterpart_crypto_wallet_id = models.CharField(max_length=128, blank=False, null=True)

    consumer = models.ForeignKey('users.Consumer', null=True, on_delete=models.SET_NULL, related_name='transactions')
    merchant = models.ForeignKey('users.Merchant', null=True, on_delete=models.SET_NULL, related_name='transactions')

    counterpart_consumer = models.ForeignKey('users.Consumer', null=True, on_delete=models.SET_NULL,
                                             related_name='counterpart_transactions')
    counterpart_merchant = models.ForeignKey('users.Merchant', null=True, on_delete=models.SET_NULL,
                                             related_name='counterpart_transactions')

    original_transaction = models.ForeignKey('self', null=True, blank=True, related_name='return_transactions',
                                             on_delete=models.SET_NULL)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f'txn[ {self.transaction_id} ] ({self.method_or_memo})'

    @property
    def confirmations(self):
        if settings.DEBUG:
            return 0
        if self.receipt is not None:
            return 1
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

    @property
    def get_consumer_data(self):
        if hasattr(self, 'consumer'):
            return self.consumer

    @property
    def get_merchant_data(self):
        if hasattr(self, 'merchant'):
            return self.merchant

    @cachedclassproperty
    def events_to_listen(cls):
        from celo_humanity.humanity_contract_helpers import get_humanity_contract
        contract_events = get_humanity_contract().proxy.contract.events
        return [
            contract_events.RedemptionFee(),
            contract_events.RoundUpEvent(),
        ]

    def process_receipt_events(self, save=True):
        if not is_json(self.receipt):
            return
        receipt = json.loads(self.receipt, object_hook=hextring_object_hook)
        self.events_in_receipt = json.loads(json.dumps(
           list(flat_map(lambda evt: evt.processReceipt(receipt), self.events_to_listen)),
           cls=MyWeb3JsonEncoder,
        ))
        if save:
            self.save()

    def get_receipt(self, save=True, timeout=10):
        try:
            rcp = get_txn_receipt(self.transaction_id, timeout=timeout)
            self.receipt = to_json(rcp)
            if save:
                self.save()
            self.process_receipt_events(save)
        except TimeExhausted:
            print(f'Error getting receipt for txn {self.transaction_id}')

    @property
    def balance_left_to_return(self):
        returned = sum(Transaction.objects.filter(original_transaction=self).values_list('amount', flat=True))
        return self.amount - returned

    def transaction_is_credit(self, profile):
        if self.type == Transaction.Type.transfer:
            return self.counterpart_profile == profile
        else:
            return self.type == Transaction.Type.deposit


class ACHTransaction(models.Model):
    class Type(models.TextChoices):
        withdraw = 'Withdraw'
        deposit = 'Deposit'

    class Status(models.TextChoices):
        pending = "pending"
        processed = "processed"
        cancelled = "cancelled"
        failed = "failed"

    transaction_id = models.CharField(max_length=255, null=False, blank=False, db_index=True)
    created_at = models.DateTimeField(null=True)
    ach_id = models.CharField(max_length=10, null=True)
    status = models.CharField(max_length=10, choices=Status.choices)
    type = models.CharField(max_length=255, null=False, blank=True, choices=Type.choices)
    consumer = models.ForeignKey('users.Consumer', null=True, on_delete=models.SET_NULL,
                                 related_name='ach_transactions', blank=True)
    merchant = models.ForeignKey('users.Merchant', null=True, on_delete=models.SET_NULL,
                                 related_name='ach_transactions', blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    amount = models.DecimalField(default=0.0, decimal_places=2, max_digits=14)
    currency = models.CharField(max_length=5, null=True, blank=True)
    bank_account = models.ForeignKey('home.BankAccount', null=True, on_delete=models.SET_NULL,
                                     related_name='ach_transactions', blank=True)
    crypto_transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True, blank=True, related_name='ach_transactions')
    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.ach_id

    @property
    def get_consumer_data(self):
        if hasattr(self, 'consumer'):
            return self.consumer

    @property
    def get_merchant_data(self):
        if hasattr(self, 'merchant'):
            return self.merchant

    @property
    def profile(self):
        return self.consumer or self.merchant

    @profile.setter
    def profile(self, value):
        self.consumer = value if value.is_consumer else None
        self.merchant = value if value.is_merchant else None


logger = logging.getLogger('compliance')


class ComplianceAction(models.Model):
    class Status(models.TextChoices):
        pending = 'Pending'
        approved = 'Approved'
        executed = 'Executed'

    class Type(models.TextChoices):
        fund_negative_wallet = 'fund_negative'
        ######################### 'Fund negative wallet from reserve wallet'
        revert_fund_negative_wallet = 'revert_fund_negative'
        ######################### 'Send funds from negative wallet to reserve wallet to revert previous action'
        burn_from_negative_wallet = 'burn_from_negative'
        ######################### 'Burn tokens from negative wallet'
        mint_to_positive_wallet = 'mint_to_positive'
        ######################### 'Mint tokens to positive wallet'
        revert_mint_to_positive_wallet = 'revert_mint_to_positive'
        ######################### 'Burn tokens from positive wallet to revert previous action'
        transfer_adjustment_to_user = 'positive_to_user'
        ######################### 'Transfer funds from positive wallet to user'

    created_by = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='compliance_actions')
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.pending)
    type = models.CharField(max_length=255, null=False, choices=Type.choices)
    documentation = models.CharField(max_length=255, null=False, blank=True)
    created_time = models.DateTimeField(auto_now=True)
    transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True)
    approved_time = models.DateTimeField(null=True)
    executed_time = models.DateTimeField(null=True)

    consumer = models.ForeignKey('users.Consumer', null=True, on_delete=models.SET_NULL,
                                 related_name='compliance_actions')
    merchant = models.ForeignKey('users.Merchant', null=True, on_delete=models.SET_NULL,
                                 related_name='compliance_actions')

    amount = models.DecimalField(null=True, decimal_places=2, max_digits=14)

    latest_error = models.TextField(null=True)

    class Meta:
        ordering = ['-id']

    @property
    def get_consumer_data(self):
        if hasattr(self, 'consumer'):
            return self.consumer

    @property
    def get_merchant_data(self):
        if hasattr(self, 'merchant'):
            return self.merchant

    @property
    def profile(self):
        return self.consumer or self.merchant

    @profile.setter
    def profile(self, value):
        self.consumer = value if value.is_consumer else None
        self.merchant = value if value.is_merchant else None

    def approve(self):
        if self.status != ComplianceAction.Status.pending:
            raise Exception('Action not in pending state (required)')
        signoffs = self.signoffs.count()
        if signoffs < configs.NECCESARY_COMPLIANCE_SIGNOFFS:
            raise Exception(
                f'Action doesnt have neccesary signoffs to approve ({signoffs} of {configs.NECCESARY_COMPLIANCE_SIGNOFFS})')

        self.status = ComplianceAction.Status.approved
        self.approved_time = datetime.now()
        self.save()

    def pre_check_action(self):
        from celo_humanity.humanity_contract_helpers import get_wallet_balance

        if self.type == ComplianceAction.Type.fund_negative_wallet:
            if self.amount > get_wallet_balance(configs.RESERVE_WALLET_UID):
                raise ValidationError('Insufficient Reserve Wallet Balance')

        elif self.type == ComplianceAction.Type.revert_fund_negative_wallet:
            if self.amount > get_wallet_balance(configs.NEGATIVE_ADJUSTMENT_WALLET_UID):
                raise ValidationError('Insufficient Negative Adjustment Wallet Balance')

        elif self.type == ComplianceAction.Type.burn_from_negative_wallet:
            if self.amount > get_wallet_balance(configs.NEGATIVE_ADJUSTMENT_WALLET_UID):
                raise ValidationError('Insufficient Negative Adjustment Wallet Balance')

        elif self.type == ComplianceAction.Type.mint_to_positive_wallet:
            pass

        elif self.type == ComplianceAction.Type.revert_mint_to_positive_wallet:
            if self.amount > get_wallet_balance(configs.POSITIVE_ADJUSTMENT_WALLET_UID):
                raise ValidationError('Insufficient Positive Adjustment Wallet Balance')

        elif self.type == ComplianceAction.Type.transfer_adjustment_to_user:
            if self.amount > get_wallet_balance(configs.POSITIVE_ADJUSTMENT_WALLET_UID):
                raise ValidationError('Insufficient Positive Adjustment Wallet Balance')

    def execute(self):
        if self.status != ComplianceAction.Status.approved:
            raise Exception('Action not in approved state (required)')
        try:
            from celo_humanity.humanity_contract_helpers import transfer_coin, burn_coin, mint_coin

            tx = None
            if self.type == ComplianceAction.Type.fund_negative_wallet:
                tx = transfer_coin(
                    from_uid=configs.RESERVE_WALLET_UID,
                    to_uid=configs.NEGATIVE_ADJUSTMENT_WALLET_UID,
                    amount=self.amount,
                    roundup_amount=0,
                    profile=None,
                    counterpart_profile=None,
                )

            elif self.type == ComplianceAction.Type.revert_fund_negative_wallet:
                tx = transfer_coin(
                    from_uid=configs.NEGATIVE_ADJUSTMENT_WALLET_UID,
                    to_uid=configs.RESERVE_WALLET_UID,
                    amount=self.amount,
                    roundup_amount=0,
                    profile=None,
                    counterpart_profile=None,
                )

            elif self.type == ComplianceAction.Type.burn_from_negative_wallet:
                tx = burn_coin(
                    from_uid=configs.NEGATIVE_ADJUSTMENT_WALLET_UID,
                    amount=self.amount,
                    profile=None,
                )

            elif self.type == ComplianceAction.Type.mint_to_positive_wallet:
                tx = mint_coin(
                    to_uid=configs.POSITIVE_ADJUSTMENT_WALLET_UID,
                    amount=self.amount,
                    profile=None,
                )

            elif self.type == ComplianceAction.Type.revert_mint_to_positive_wallet:
                tx = burn_coin(
                    from_uid=configs.POSITIVE_ADJUSTMENT_WALLET_UID,
                    amount=self.amount,
                    profile=None,
                )

            elif self.type == ComplianceAction.Type.transfer_adjustment_to_user:
                tx = transfer_coin(
                    from_uid=configs.POSITIVE_ADJUSTMENT_WALLET_UID,
                    to_uid=self.profile.crypto_wallet_id,  # must have wallet
                    amount=self.amount,
                    roundup_amount=0,
                    profile=None,
                    counterpart_profile=self.profile,
                )

            self.transaction = tx
            self.status = ComplianceAction.Status.executed
            self.executed_time = datetime.now()
            self.save()
            return True
        except Exception as exc:
            # TODO narrow exception
            self.latest_error = f'{type(exc).__name__}: {exc}'
            self.executed_time = datetime.now()
            self.save()
            logger.exception("Error executing compliance action")
        return False


class ComplianceActionSignoff(models.Model):
    action = models.ForeignKey(ComplianceAction, null=False, on_delete=models.CASCADE, related_name='signoffs')
    signoff_time = models.DateTimeField(auto_now=True)
    user = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='signoffs')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['action_id', 'user_id'], name='one signoff per user')
        ]
        ordering = ['-id']
