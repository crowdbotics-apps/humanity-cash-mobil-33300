from django.contrib import admin

# Register your models here.
from celo_humanity.models import Contract, Transaction, ACHTransaction


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    ...


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'amount','consumer', 'merchant']


@admin.register(ACHTransaction)
class ACHTransactionAdmin(admin.ModelAdmin):
    ...