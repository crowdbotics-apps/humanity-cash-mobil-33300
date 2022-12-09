import time

from cities_light.models import Region
from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

from celo_humanity.humanity_contract_helpers import NoWalletException, get_wallet_balance, transfer_coin, get_wallet, \
    deposit_coin, withdraw_coin, WalletAlreadyCreatedException
from celo_humanity.web3helpers import get_provider, text2keccak
from humanity_cash_mobil_33300 import settings
from users.constants import Industry, UserGroup, UserRole


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
    group = models.CharField(max_length=7, choices=UserGroup.choices, null=True)
    role = models.CharField(max_length=10, choices=UserRole.choices, null=True)
    google_id = models.CharField('Google ID', max_length=255, blank=True, null=True)
    google_token = models.TextField('Google Token', blank=True, null=True)
    phone_number = PhoneNumberField('Phone Number', max_length=50, null=True, blank=True)
    is_admin = models.BooleanField(default=False)

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
    city = models.CharField(max_length=150, null=True, blank=True)
    state = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    zip_code = models.CharField(max_length=16, null=True, blank=True)
    dwolla_id = models.CharField(max_length=50, null=True, blank=True)

    crypto_wallet_id = models.CharField(max_length=128, blank=True, null=True)

    class Meta:
        abstract = True

    def new_wallet(self, save=True):  # WHEN the wallet is new, find a free uid to generate wallet
        if self.crypto_wallet_id is None:
            new_uid = uid = None
            while new_uid is None:
                try:
                    uid = text2keccak(f'{time.time()}{self.id}')
                    get_wallet(uid, create=False)
                except NoWalletException:  # good, is a fresh uid
                    get_wallet(uid, create=True, profile=self)
                    new_uid = uid
                except:
                    return 0
                    # TODO log when gets a error while create the wallet

            self.crypto_wallet_id = new_uid
            if save:
                self.save()
            return new_uid
        else:
            raise WalletAlreadyCreatedException()

    @property
    def balance(self):
        if self.crypto_wallet_id is None:
            self.new_wallet()
        return get_wallet_balance(self.crypto_wallet_id)

    def transfer(self, other_user, amount, roundup = 0): # other user can be a merchant or an user! yay duck typing!
        if not hasattr(other_user, 'crypto_wallet_id') or self.crypto_wallet_id is None or other_user.crypto_wallet_id is None:
            raise InvalidTransferDestinationException()
        # TODO validate ammount or let contract fail and catch?
        # TODO catch contract exceptions
        transaction = transfer_coin(self.crypto_wallet_id,
                                    other_user.crypto_wallet_id,
                                    amount,
                                    roundup,
                                    profile=self,
                                    counterpart_profile=other_user)
        if transaction:
            from home.helpers import send_notifications
            try:
                send_notifications([other_user],
                                   'Withdraw',
                                   transaction.method_or_memo,
                                   '',
                                   self.user,
                                   Notification.Types.TRANSACTION,
                                   transaction=transaction)
            except: print(' User has no devices')
    

    def deposit(self, amount):
        if self.crypto_wallet_id is None:
            self.crypto_wallet_id = self.new_wallet()
        transaction = deposit_coin(self.crypto_wallet_id, amount, profile=self)
        if transaction:
            from home.helpers import send_notifications

            send_notifications([self.user],
                               'New Deposit',
                               f'deposit (mint) {amount} to your wallet {self.crypto_wallet_id}',
                               '',
                               self.user,
                               Notification.Types.TRANSACTION,
                               transaction=transaction)


    def withdraw(self, amount):
        if self.crypto_wallet_id is None:
            self.crypto_wallet_id = self.new_wallet()
        transaction = withdraw_coin(self.crypto_wallet_id, amount, profile=self)
        if transaction:
            from home.helpers import send_notifications

            send_notifications([self.user],
                               'Withdraw',
                               f'withdraw (burn) {amount} from user {self.crypto_wallet_id}',
                               '',
                               self.user,
                               Notification.Types.TRANSACTION,
                               transaction=transaction)



class Consumer(BaseProfileModel):

    class Meta:
        db_table = 'consumer'

    @property
    def is_consumer(self):
        return True

    @property
    def is_merchant(self):
        return False

    def __str__(self):
        return f'Customer id: {self.id}'


class Merchant(BaseProfileModel):
    profile_picture = models.ImageField(upload_to='profile-pictures', null=True, blank=True)
    background_picture = models.ImageField(upload_to='background-pictures', null=True, blank=True)
    business_name = models.CharField(max_length=50)
    business_story = models.CharField(max_length=250, null=True, blank=True)
    type_of_business = models.CharField(max_length=50, null=True, blank=True)
    registered_business_name = models.CharField(max_length=50, null=True, blank=True)
    industry = models.CharField(max_length=50, choices=Industry.choices, null=True, blank=True)
    website = models.CharField(max_length=250, null=True, blank=True)
    employer_identification_number = models.CharField(max_length=50, null=True, blank=True)
    social_security_number = models.CharField(max_length=50, null=True, blank=True)
    phone_number = PhoneNumberField(null=True, blank=True)
    owner_first_name = models.CharField(max_length=150, null=True, blank=True)
    owner_last_name = models.CharField(max_length=150, null=True, blank=True)
    address_1 = models.CharField(max_length=150, null=True, blank=True)
    address_2 = models.CharField(max_length=150, null=True, blank=True)
    city = models.CharField(max_length=150, null=True, blank=True)
    state = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    zip_code = models.CharField(max_length=16, null=True, blank=True)
    location = models.PointField(null=True, blank=True)
    instagram = models.CharField(max_length=250, null=True, blank=True)
    facebook = models.CharField(max_length=250, null=True, blank=True)
    twitter = models.CharField(max_length=250, null=True, blank=True)


    class Meta:
        db_table = 'merchant'

    @property
    def is_consumer(self):
        return False

    @property
    def is_merchant(self):
        return True

    def __str__(self):
        return f'Merchant id: {self.id}'


class DwollaUser(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=100, null=True)
    email = models.CharField(max_length=100, null=True)
    last_login = models.DateTimeField(null=True)
    date_joined = models.DateTimeField(null=True)
    dwolla_id = models.CharField(max_length=50, null=True, blank=True)
    crypto_wallet_id = models.CharField(max_length=128, blank=True, null=True)
    account_type = models.CharField(max_length=100, null=True)
    address = models.CharField(max_length=150, null=True, blank=True)

    class Meta:
        db_table = "dwolla_user"
        managed = False


class Coupon(models.Model):
    title = models.CharField(max_length=100)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    type_of_promo = models.CharField(max_length=100, null=True, blank=True)
    discount_input = models.CharField(max_length=100, null=True, blank=True)
    description = models.CharField(max_length=250, null=True, blank=True)
    code = models.CharField(max_length=64, null=True, blank=True)
    promo_image = models.ImageField(upload_to='coupons-pictures', null=True, blank=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE, related_name='coupons')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)


class ConsumerCoupon(models.Model):
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE, related_name='consumer_coupons')
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name='consumer_coupons')
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class NoMerchantProfileException(Exception):
    pass


class InvalidTransferDestinationException(Exception):
    pass




class UserDevice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    device_id = models.CharField('Device ID', max_length=64)
    device_token = models.CharField('Device token', max_length=200, null=True, blank=True)
    active = models.BooleanField(default=True)
    date_added = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User device'
        ordering = ['-id']
        unique_together = ['user', 'device_id']

    @staticmethod
    def activate_device(user, device_id, device_token):
        if not device_id:
            return
        try:
            device = user.devices.get(device_id=device_id)
            device.active = True
            device.device_token = device_token
            device.save()
        except UserDevice.DoesNotExist:
            UserDevice.objects.create(
                user=user,
                device_id=device_id,
                device_token=device_token
            )

    @staticmethod
    def deactivate_device(user, device_id):
        if not device_id:
            return
        try:
            device = user.devices.get(device_id=device_id)
            device.active = False
            device.save()
        except UserDevice.DoesNotExist:
            pass

    @staticmethod
    def deactivate_all_devices(user):
        devices = user.devices.all()
        for device in devices:
            device.active = False
            device.save()

    def __str__(self):
        return "{} - {}".format(self.device_id, self.user.username)



class Notification(models.Model):



    class Actions(models.IntegerChoices):
        READ = 10, 'Read notification'
        ACCEPT_ACCESS = 20, 'Accept notification'
        REJECT_ACCESS = 30, 'Reject notification'

    class Types(models.IntegerChoices):
        ADMIN = 10, 'Notifications sent by the admin'
        TRANSACTION = 20, 'Notifications for transactions'



    target = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications_to_user")
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,
                                  related_name="notifications_from_user")
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    extra_data = models.TextField(null=True, blank=True)
    type = models.IntegerField(choices=Types.choices)
    sent = models.BooleanField(default=False)
    error_on_send = models.TextField(null=True)

    transaction = models.ForeignKey('celo_humanity.Transaction', on_delete=models.CASCADE,
                                    related_name='notifications',
                                    null=True, blank=True)

    ach_transaction = models.ForeignKey('celo_humanity.ACHTransaction', on_delete=models.CASCADE,
                                        related_name='notifications', null=True, blank=True)

    def __str__(self):
        from_user = self.from_user.username if self.from_user else ''
        target = self.target.username if self.target else ''
        return '{} - {} to {}'.format(self.id, from_user, target)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-timestamp']
