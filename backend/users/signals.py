from django.contrib.auth import user_logged_in, user_logged_out
from django.dispatch.dispatcher import receiver
from django.db.models.functions import Now

from users.models import UserActivity


@receiver(user_logged_in)
def register_login(sender, user, request, **kwargs):
    if request.session.session_key is not None:
        UserActivity.objects.create(
            user=user,
            session_key=request.session.session_key
        )

@receiver(user_logged_out)
def register_logout(sender, user, request, **kwargs):
    UserActivity.objects.filter(
        user=user,
        session_key=request.session.session_key
    ).update(
        logout=Now()
    )
