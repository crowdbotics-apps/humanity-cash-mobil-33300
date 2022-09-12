from cities_light.models import City, Region
from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

from users.constants import Industry


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
    allow_touch_id = models.BooleanField(default=False)
    facebook_id = models.CharField('Facebook ID', max_length=64, blank=True, null=True)
    facebook_token = models.TextField('Facebook Token', blank=True, null=True)
    google_id = models.CharField('Google ID', max_length=255, blank=True, null=True)
    google_token = models.TextField('Google Token', blank=True, null=True)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    @property
    def get_consumer_data(self):
        if hasattr(self, 'consumer'):
            return self.consumer

    @property
    def get_merchant_data(self):
        if hasattr(self, 'merchant'):
            return self.merchant


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
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile-pictures', null=True, blank=True)
    address_1 = models.CharField(max_length=150, null=True, blank=True)
    address_2 = models.CharField(max_length=150, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    state = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    zip_code = models.CharField(max_length=16, null=True, blank=True)
    dwolla_id = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        abstract = True


class Consumer(BaseProfileModel):

    class Meta:
        db_table = 'consumer'


class Merchant(BaseProfileModel):
    background_picture = models.ImageField(upload_to='background-pictures', null=True, blank=True)
    business_name = models.CharField(max_length=50)
    business_story = models.CharField(max_length=50, null=True, blank=True)
    type_of_business = models.CharField(max_length=50, null=True, blank=True)
    registered_business_name = models.CharField(max_length=50, null=True, blank=True)
    industry = models.CharField(max_length=50, choices=Industry.choices, null=True, blank=True)
    website = models.CharField(max_length=250, null=True, blank=True)
    employer_identification_number = models.CharField(max_length=50, null=True, blank=True)
    social_security_number = models.CharField(max_length=50, null=True, blank=True)
    phone_number = PhoneNumberField(null=True, blank=True)
    owner_first_name = models.CharField(max_length=150, null=True, blank=True)
    owner_last_name = models.CharField(max_length=150, null=True, blank=True)
    owner_address_1 = models.CharField(max_length=150, null=True, blank=True)
    owner_address_2 = models.CharField(max_length=150, null=True, blank=True)
    owner_city = models.CharField(max_length=100, null=True, blank=True)
    owner_state = models.CharField(max_length=2, null=True, blank=True)
    owner_zip_code = models.CharField(max_length=16, null=True, blank=True)
    location = models.PointField(null=True, blank=True)

    class Meta:
        db_table = 'merchant'
