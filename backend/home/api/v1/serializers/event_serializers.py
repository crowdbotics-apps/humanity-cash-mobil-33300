from collections import Iterable

from rest_framework import serializers

from home.models import Event


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'link', 'event_type', 'start_date', 'end_date']

