import logging
import random
import io
import base64
from email.mime.image import MIMEImage

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import UserModel
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.db.models import QuerySet
from django.utils.http import urlsafe_base64_decode
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from twilio.rest import Client
import json
from users.models import UserVerificationCode, Notification
from onesignal_sdk import Cliente as OneSignalClient

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
        from_email, to = settings.DEFAULT_FROM_EMAIL, [user.email]
        subject = "QR Code"
        body_html = """
        <html>
            <body>
                <h5>Your QR Code</h5><br/>
                <img src="cid:qr_code.png" />
                <br/>
            </body>
        </html>
        """
        msg = EmailMultiAlternatives(subject, body_html, from_email, to)
        msg.mixed_subtype = 'related'
        msg.attach_alternative(body_html, "text/html")

        img = MIMEImage(qr_code_image.open('r').read())
        img.add_header('Content-ID', '<{name}>'.format(name='qr_code.png'))
        img.add_header('Content-Disposition', 'inline', filename='qr_code.png')
        msg.attach(img)
        msg.send()

    except Exception as e:
        LOGGER.exception('QR Code sending failed: {}'.format(e))



def send_notifications(users, title, message, extra_data, from_user,
                       notification_type,
                       transaction=None,
                       ach_transaction=None):
    if not isinstance(users, QuerySet) and not isinstance(users, list):
        push_users = [users]
    else:
        push_users = users
    for user in push_users:
        notification = Notification.objects.create(
            target=user,
            from_user=from_user,
            title=title,
            description=message,
            type=notification_type,
            extra_data=extra_data,
            transaction=transaction,
            ach_transaction=ach_transaction
        )
        devices = user.devices.filter(active=True)
        if not devices.exists():
            error_message = 'The user {} doesnt have any active devices '.format(user.username)
            LOGGER.warning(error_message)
            notification.error_on_send = error_message
            notification.save()
            continue
        send_push(title, message, extra_data, list(devices.values_list('device_id', flat=True)), notification)


def send_push(title, message, extra_data, devices_ids=None, notification_object=None):
    if devices_ids is not None and not len(devices_ids):
        return
    osclient = OneSignalClient(
        rest_api_key=settings.ONESIGNAL_REST_API_KEY,
        app_id=settings.ONESIGNAL_APP_ID,
        user_auth_key=settings.ONESIGNAL_USER_AUTH_KEY
    )
    notification = {
        "headings": {"en": title, "es": title},
        "contents": {"en": message, "es": message},
        "content_available": True,
        "data": json.loads(json.dumps(extra_data)) if extra_data != '' else {}
    }
    if devices_ids:
        notification.update({"include_player_ids": devices_ids})
    else:
        notification.update({"included_segments": ['Subscribed Users']})
    LOGGER.info('Sending process start')
    try:
        osclient.send_notification(notification)
        notification_object.sent = True
        notification_object.save()
        LOGGER.info('Notification sent. notification: {}'.format(json.dumps(notification)))
    except Exception as e:
        print('print Push sending failed: {}'.format(e))
        LOGGER.info('logger Push sending failed: {}'.format(e))
        LOGGER.info('logger message Push sending failed: {}'.format(e.message))
        notification_object.sent = False
        notification_object.error_on_send = e.message
        notification_object.save()
        return False
    LOGGER.info('Sending process finished')
    return True

