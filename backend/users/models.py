from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField


def code_live_time():
    return timezone.now() + timezone.timedelta(hours=1)


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    verified_email = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})


class PasswordReset(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    pass_reset_token = models.CharField(_("Password Reset Token"), max_length=10, null=True)
    expires_on = models.DateTimeField(_("Expires On"), default=code_live_time)
    timestamp = models.DateTimeField(_("Timestamp"), auto_now_add=True)
    active = models.BooleanField(default=True)


class UserVerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verification_code = models.CharField(_("Verification code"), max_length=6)
    expires_on = models.DateTimeField(_("Expires On"), default=code_live_time)
    timestamp = models.DateTimeField(_("Timestamp"), auto_now_add=True)
    active = models.BooleanField(default=True)


class BaseProfileModel(models.Model):
    profile_picture = models.ImageField(upload_to='profile-pictures', null=True, blank=True)
    address_1 = models.CharField(max_length=150)
    address_2 = models.CharField(max_length=150, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=16)

    class Meta:
        abstract = True


class Consumer(BaseProfileModel):

    class Meta:
        db_table = 'consumer'


class Merchant(BaseProfileModel):
    background_picture = models.ImageField(upload_to='background-pictures', null=True, blank=True)
    business_name = models.CharField(max_length=50)
    business_story = models.CharField(max_length=50, null=True, blank=True)
    type_of_business = models.CharField(max_length=50)
    registered_business_name = models.CharField(max_length=50)
    industry = models.CharField(max_length=50)
    phone_number = PhoneNumberField(null=True, blank=True)
    owner_first_name = models.CharField(max_length=150)
    owner_last_name = models.CharField(max_length=150)
    owner_address_1 = models.CharField(max_length=150)
    owner_address_2 = models.CharField(max_length=150, null=True, blank=True)
    owner_city = models.CharField(max_length=100)
    owner_state = models.CharField(max_length=2)
    owner_zip_code = models.CharField(max_length=16)

    class Meta:
        db_table = 'merchant'
