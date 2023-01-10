from django.contrib import admin

from home.models import Event, DwollaEvent, BankAccount, DatedSystemBalanceBankBalances, DatedSystemBalance
from users.models import Consumer, Merchant, DwollaUser, Notification, UserDevice


@admin.register(Consumer)
class ConsumerAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'city', 'state']
    search_fields = ['user_username']
    readonly_fields = ['dwolla_id', 'crypto_wallet_id']

@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'business_name', 'city', 'state']
    search_fields = ['user_username', 'business_name']

@admin.register(DwollaUser)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'email', 'last_login', 'account_type', 'dwolla_id', 'crypto_wallet_id']
    search_fields = ['name', 'email']




@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'description', 'start_date']
    search_fields = ['title']

@admin.register(DwollaEvent)
class DwollaEventAdmin(admin.ModelAdmin):
    ...

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    ...

@admin.register(UserDevice)
class UserDeviceAdmin(admin.ModelAdmin):
    ...


@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    ...


@admin.register(DatedSystemBalance)
class DatedSystemBalanceAdmin(admin.ModelAdmin):
    ...


@admin.register(DatedSystemBalanceBankBalances)
class DatedSystemBalanceBankBalancesAdmin(admin.ModelAdmin):
    ...

