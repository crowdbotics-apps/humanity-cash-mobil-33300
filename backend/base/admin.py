from django.contrib import admin

# Register your models here.
from django.utils.safestring import mark_safe

from base import configs
from base.models import Configuration
from users.models import Coupon, ConsumerCoupon


@admin.register(Configuration)
class ConfigAdmin(admin.ModelAdmin):
    search_fields = ['value']
    list_display = ['description', 'value']
    readonly_fields = ['description']
    exclude = ['key']

    def _image(self, obj):
        if obj.image:
            return mark_safe(f'<img style="width:100px " src="{obj.image.url}"/>')
        return ''


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    ...


@admin.register(ConsumerCoupon)
class ConsumerCouponAdmin(admin.ModelAdmin):
    ...

