from django.contrib import admin

# Register your models here.
from celo_humanity.models import Contract, Transaction, ACHTransaction, ComplianceAction


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    ...


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'amount','consumer', 'merchant']


@admin.register(ACHTransaction)
class ACHTransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'transaction_id', 'type', 'status', 'bank_account', 'amount']


@admin.register(ComplianceAction)
class ComplianceActionAdmin(admin.ModelAdmin):
    ...

