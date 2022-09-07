from rest_framework import permissions, viewsets
from rest_framework.response import Response

from home.api.v1.serializers.event_serializers import EventSerializer
from home.models import Event


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = []

