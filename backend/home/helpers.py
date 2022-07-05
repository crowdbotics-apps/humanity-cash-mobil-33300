import logging
import random
import io
import base64

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import UserModel
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_decode
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from twilio.rest import Client

from users.models import UserVerificationCode

LOGGER = logging.getLogger('django')

User = get_user_model()


def send_email(user_email, subject, text_content):
    try:
        from_email, to = settings.DEFAULT_FROM_EMAIL, user_email
        html_content = text_content
        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

    except Exception as e:
        LOGGER.exception('Email sending failed: {}'.format(e))


def setup_verification_code(user):
    code = random.randint(100000, 999999)
    user_code = UserVerificationCode.objects.filter(user=user)
    if user_code.exists():
        user_code_modify = user_code.first()
        user_code_modify.verification_code = code
        user_code_modify.save()
    else:
        UserVerificationCode.objects.create(user=user, verification_code=code)

    return code


def send_verification_email(user, code):
    try:
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


def send_sms(message, to):
    try:
        twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        twilio_client.messages.create(
            body=message,
            to=to,
            from_=settings.TWILIO_NUMBER,
        )
    except Exception as e:
        LOGGER.exception('SMS sending failed: {}'.format(e))


def send_verification_phone(user, code, phone_number):
    message = f"""Verification code. 
    Hello!
    Please use the Verification code bellow to complete the verification process
    {code}
    Thank you."""

    send_sms(message, phone_number)


class AuthenticatedAPIView(APIView):
    permission_classes = [IsAuthenticated]


def get_user_by_uidb64(uidb64):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User._default_manager.get(pk=uid)
    except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist, ValidationError):
        user = None
    return user


def send_qr_code_email(user, qr_code_image):
    try:


        subject = "QR Code"
        text_content = f"""<h5>Your QR Code</h5><br/>
        <img src="data:image/png;base64,{base64.b64encode(qr_code_image.open('rb').read()).decode('utf-8')}" alt="QR" style="width:250px;height:50px;">
        <br/>
        """
        send_email(
            subject=subject,
            text_content=text_content,
            user_email=[user.email]
        )
    except Exception as e:
        LOGGER.exception('QR Code sending failed: {}'.format(e))
