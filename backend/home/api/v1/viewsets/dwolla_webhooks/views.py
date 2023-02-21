import json

import munch
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from home.api.v1.viewsets.dwolla_webhooks import DwollaSignatureIsValid, logger
from home.api.v1.viewsets.dwolla_webhooks.transfers.created import transfer_created_listener
from home.api.v1.viewsets.dwolla_webhooks.transfers.failed_cancelled import transfer_cancelled_or_failed_listener
from home.api.v1.viewsets.dwolla_webhooks.transfers.processed import transfer_completed_listener
from home.models.dwolla import DwollaEvent


class DwollaWebhooksView(APIView):
    #permission_classes = [~IsAuthenticated & DwollaSignatureIsValid]
    listeners = dict(
        customer_transfer_completed=transfer_completed_listener,
        customer_transfer_created=transfer_created_listener,
        customer_transfer_cancelled=transfer_cancelled_or_failed_listener,
        customer_transfer_failed=transfer_cancelled_or_failed_listener,
    )

    def post(self, request, *args, **kwargs):
        try:
            event = munch.munchify(json.loads(request.body))
            event_id = event.id
            if not DwollaEvent.objects.filter(eventId=event_id).exists():
                event_db = DwollaEvent.objects.create(
                    eventId=event_id,
                    topic=event.topic,
                    resourceId=event.resourceId,
                    timestamp=event.timestamp,
                    resourceLink=event['_links'].resource.href,
                    customerLink=event['_links'].customer.href if 'customer' in event['_links'] else None,
                )
                logger.info(f'dwolla event {event} ')

                logger.info(f'dwolla event {event_id}  [  {event.topic}  ] created')
                if event.topic in self.listeners:
                    try:
                        self.listeners[event.topic](event, event_db)
                    except:
                        logger.exception(f'dwolla listener error, event {event_id}, topic {event.topic}')
            else:
                logger.warning(f'Duplicated dwolla event: {event_id}, ignoring')
        except:
            logger.exception('Dwolla webhook exception')
        return Response(status=status.HTTP_200_OK)


