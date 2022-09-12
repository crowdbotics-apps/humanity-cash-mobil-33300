from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel

from home.utils import picture_upload_dir

User = get_user_model()


def image_upload_dir(instance, filename):
    return picture_upload_dir(instance, "event_images", filename)


class Event(TimeStampedModel):
    class EventType(models.TextChoices):
        STORY = ('story', 'Story')
        EVENT = ('event', 'Event')

    title = models.CharField(max_length=200)
    link = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=200, null=True, blank=True)
    event_type = models.CharField(max_length=5, choices=EventType.choices)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    image = models.ImageField(
        _("Event Picture"),
        blank=True,
        null=True,
        upload_to=image_upload_dir
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['start_date']
