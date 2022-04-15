import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

LOGGER = logging.getLogger('django')


def send_email(user_email, subject, text_content):
    try:
        from_email, to = settings.DEFAULT_FROM_EMAIL, user_email
        html_content = text_content
        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

    except Exception as e:
        LOGGER.exception('Email sending failed: {}'.format(e))


class AuthenticatedAPIView(APIView):
    permission_classes = [IsAuthenticated]
