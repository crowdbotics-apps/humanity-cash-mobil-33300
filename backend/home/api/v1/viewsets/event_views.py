from rest_framework import permissions, viewsets
from rest_framework.response import Response

from home.api.v1.serializers.event_serializers import EventSerializer
from home.models import Event


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = []

    
    def get_queryset(self):
        start = self.request.GET.get('start', None)
        end = self.request.GET.get('end', None)
        all_qs = super(EventViewSet, self).get_queryset()
        if start and end :
            events = all_qs.filter(start_date__gt=start, start_date__lte=end, event_type=Event.EventType.EVENT)
            stories = all_qs.filter(start_date__gt=start, start_date__lte=end, event_type=Event.EventType.STORY)
            all_qs = (events | stories).order_by('start_date')

        return all_qs

