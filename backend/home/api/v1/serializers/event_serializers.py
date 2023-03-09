from collections import Iterable

from django.core.validators import URLValidator
from django.forms import URLField
from rest_framework import serializers

from home.models import Event


class EventSerializer(serializers.ModelSerializer):
    link = serializers.URLField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'link', 'event_type', 'start_date', 'end_date', 'image']
