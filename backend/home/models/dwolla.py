from django.db import models
from model_utils.models import TimeStampedModel


class DwollaOperation(TimeStampedModel):
    class Type(models.IntegerChoices):
        WITHDRAW = 1
        DEPOSIT = 2

    class Status(models.IntegerChoices):
        CREATED = 1
        PENDING = 2
        COMPLETED = 3
        CANCELLED = 4

    customerLink = models.CharField(max_length=200, null=True)
    crypto_transaction = models.ForeignKey('celo_humanity.Transaction', null=True, blank=True, related_name='dwolla_counterpart', on_delete=models.SET_NULL)
    status = models.IntegerField(choices=Status.choices)
    type = models.IntegerField(choices=Type.choices)
    amount = models.DecimalField(null=True, decimal_places=2, max_digits=14)
    timestamp = models.DateTimeField()

    source = models.JSONField(null=True, blank=True)
    destination = models.JSONField(null=True, blank=True)


class DwollaEvent(TimeStampedModel):
    eventId = models.CharField(max_length=200, unique=True)
    topic = models.CharField(max_length=200)
    resourceId = models.CharField(max_length=200)
    resourceLink = models.CharField(max_length=200)
    customerLink = models.CharField(max_length=200, null=True)
    timestamp = models.DateTimeField(null=True)


