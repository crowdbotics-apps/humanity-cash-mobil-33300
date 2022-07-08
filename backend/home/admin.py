from django.contrib import admin

from users.models import Consumer, Merchant


@admin.register(Consumer)
class ConsumerAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'city', 'state']
    search_fields = ['user_username']


@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'business_name', 'city', 'state']
    search_fields = ['user_username', 'business_name']
