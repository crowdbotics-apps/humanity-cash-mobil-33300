import logging
import random

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from users.models import UserVerificationCode

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


def send_verification_email(user):
    try:
        code = random.randint(100000, 999999)
        user_code = UserVerificationCode.objects.filter(user=user)
        if user_code.exists():
            user_code_modify = user_code.first()
            user_code_modify.verification_code = code
            user_code_modify.save()
        else:
            UserVerificationCode.objects.create(user=user, verification_code=code)
        subject = "Verification code"
        text_content = f"""<h5>Hello!</h5><br/>
        Please use the Verification code bellow to complete the verification process<br/>
        <b>{code}</b><br/>
        Thank you."""
        send_email(
            subject=subject,
            text_content=text_content,
            user_email=[user.email]
        )
    except Exception as e:
        LOGGER.exception('Verification email sending failed: {}'.format(e))


class AuthenticatedAPIView(APIView):
    permission_classes = [IsAuthenticated]
