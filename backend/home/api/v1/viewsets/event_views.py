from rest_framework import permissions, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from home.api.v1.serializers.event_serializers import EventSerializer
from home.models import Event


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):
        start = self.request.GET.get('start', None)
        end = self.request.GET.get('end', None)
        qs = super(EventViewSet, self).get_queryset().order_by('start_date')
        if start and end :
            qs = qs.filter(start_date__gte=start, start_date__lte=end)
        return qs

