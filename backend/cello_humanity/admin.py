from django.contrib import admin

# Register your models here.
from cello_humanity.models import Contract, Transaction


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    ...

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    ...