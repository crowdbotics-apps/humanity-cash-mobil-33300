"""
Django settings for humanity_cash_mobil_33300 project.

Generated by 'django-admin startproject' using Django 2.2.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import io
from datetime import timedelta

import environ
import logging
import google.auth
from google.cloud import secretmanager
from google.auth.exceptions import DefaultCredentialsError
from google.api_core.exceptions import PermissionDenied
# from modules.manifest import get_modules

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env_file = os.path.join(BASE_DIR, ".env")
env = environ.Env()
env.read_env(env_file)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG", default=False)

try:
    # Pull secrets from Secret Manager
    _, project = google.auth.default()
    client = secretmanager.SecretManagerServiceClient()
    settings_name = os.environ.get("SETTINGS_NAME", "django_settings")
    name = client.secret_version_path(project, settings_name, "latest")
    payload = client.access_secret_version(name=name).payload.data.decode("UTF-8")
    env.read_env(io.StringIO(payload))
except (DefaultCredentialsError, PermissionDenied):
    pass


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY")

ALLOWED_HOSTS = env.list("HOST", default=["*"])
SITE_ID = 1

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env.bool("SECURE_REDIRECT", default=False)

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.gis'
]
LOCAL_APPS = [
    'home',
    'users.apps.UsersConfig',
    'celo_humanity',
    'base'
]
THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'bootstrap4',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'django_extensions',
    'drf_yasg',
    'storages',
    'phonenumber_field',
    'django_filters',
    'cities_light',
    'corsheaders',
]
# MODULES_APPS = get_modules()

INSTALLED_APPS += LOCAL_APPS + THIRD_PARTY_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'humanity_cash_mobil_33300.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'web_build'),
                 os.path.join(BASE_DIR, 'templates')
                 ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'humanity_cash_mobil_33300.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

if env.str("DATABASE_URL", default=None):
    DATABASES = {
        'default': env.db(engine='django.contrib.gis.db.backends.postgis')
    }


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

if DEBUG:
    AUTH_PASSWORD_VALIDATORS = []
else:
    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
            'OPTIONS': {
                'min_length': 12,
            }
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        }
]

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

MIDDLEWARE += ['whitenoise.middleware.WhiteNoiseMiddleware']

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend'
)

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'), os.path.join(BASE_DIR, 'web_build/static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# allauth / users
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_CONFIRM_EMAIL_ON_GET = False
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = False
ACCOUNT_UNIQUE_EMAIL = True
LOGIN_REDIRECT_URL = "users:redirect"

ACCOUNT_ADAPTER = "users.adapters.AccountAdapter"
SOCIALACCOUNT_ADAPTER = "users.adapters.SocialAccountAdapter"
ACCOUNT_ALLOW_REGISTRATION = env.bool("ACCOUNT_ALLOW_REGISTRATION", True)
SOCIALACCOUNT_ALLOW_REGISTRATION = env.bool("SOCIALACCOUNT_ALLOW_REGISTRATION", True)

# REST Configuration

REST_USE_JWT = True

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 9,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    )
}

REST_AUTH_SERIALIZERS = {
    # Replace password reset serializer to fix 500 error
    # "PASSWORD_RESET_SERIALIZER": "home.api.v1.serializers.PasswordSerializer",
    "USER_DETAILS_SERIALIZER": "home.api.v1.serializers.signup_signin_serializers.UserDetailSerializer",
    'LOGIN_SERIALIZER': 'home.api.v1.serializers.signup_signin_serializers.LoginSerializer',

}
REST_AUTH_REGISTER_SERIALIZERS = {
    # Use custom serializer that has no username and matches web signup
    "REGISTER_SERIALIZER": "home.api.v1.serializers.signup_signin_serializers.SignupSerializer",
}


# Custom user model
AUTH_USER_MODEL = "users.User"

# Email configuration
DEFAULT_FROM_EMAIL = env.str("SENDGRID_FROM_EMAIL", "")
EMAIL_HOST = env.str("EMAIL_HOST", "smtp.sendgrid.net")
EMAIL_HOST_USER = env.str("SENDGRID_USERNAME", "")
EMAIL_HOST_PASSWORD = env.str("SENDGRID_PASSWORD", "")
EMAIL_PORT = 587
EMAIL_USE_TLS = True


# AWS S3 config
AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY", "")
AWS_STORAGE_BUCKET_NAME = env.str("AWS_STORAGE_BUCKET_NAME", "")
AWS_STORAGE_REGION = env.str("AWS_STORAGE_REGION", "")
AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_QUERYSTRING_AUTH = False

USE_S3 = (
    AWS_ACCESS_KEY_ID and
    AWS_SECRET_ACCESS_KEY and
    AWS_STORAGE_BUCKET_NAME and
    AWS_STORAGE_REGION
)

if USE_S3:
    AWS_S3_CUSTOM_DOMAIN = env.str("AWS_S3_CUSTOM_DOMAIN", "")
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}
    AWS_DEFAULT_ACL = env.str("AWS_DEFAULT_ACL", "public-read")
    AWS_MEDIA_LOCATION = env.str("AWS_MEDIA_LOCATION", "media")
    AWS_AUTO_CREATE_BUCKET = env.bool("AWS_AUTO_CREATE_BUCKET", True)
    DEFAULT_FILE_STORAGE = env.str(
        "DEFAULT_FILE_STORAGE", "home.storage_backends.MediaStorage"
    )

MEDIA_URL = '/mediafiles/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'mediafiles')

# Swagger settings for api docs
SWAGGER_SETTINGS = {
    "DEFAULT_INFO": f"{ROOT_URLCONF}.api_info",
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://0.0.0.0:3000',
]

if DEBUG or not (EMAIL_HOST_USER and EMAIL_HOST_PASSWORD):
    if not DEBUG:
        # output email to console instead of sending
        EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
        logging.warning("You should setup `SENDGRID_USERNAME` and `SENDGRID_PASSWORD` env vars to send emails.")
    else:
        EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

# Twilio
TWILIO_ACCOUNT_SID = env.str("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = env.str("TWILIO_AUTH_TOKEN", "")
TWILIO_NUMBER = env.str("TWILIO_NUMBER", "")

# Dwolla
DWOLLA_ENVIRONMENT = env.str("DWOLLA_ENVIRONMENT", default='sandbox')
DWOLLA_SANDBOX_APP_KEY = env.str("DWOLLA_SANDBOX_APP_KEY", "")
DWOLLA_SANDBOX_APP_SECRET = env.str("DWOLLA_SANDBOX_APP_SECRET", "")

DWOLLA_PRODUCTION_APP_KEY = env.str("DWOLLA_PRODUCTION_APP_KEY", "")
DWOLLA_PRODUCTION_APP_SECRET = env.str("DWOLLA_PRODUCTION_APP_SECRET", "")

# GCP config 
GS_BUCKET_NAME = env.str("GS_BUCKET_NAME", "")
if GS_BUCKET_NAME:
    DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    GS_DEFAULT_ACL = "publicRead"

CITIES_LIGHT_DATA_DIR = '/opt/webapp/cities'
CITIES_LIGHT_INCLUDE_COUNTRIES = ['US']

if not DEBUG:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration

    sentry_sdk.init(
        dsn="https://12d06379e6d64961b255efcaac6706d6@sentry.innovatica.com.py//12",
        integrations=[DjangoIntegration()],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=1.0,

        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True
    )

CONTRACT_PROVIDER_URL = env.str("CONTRACT_PROVIDER_URL", default='ws://127.0.0.1:7545')
CONTRACT_OWNER_ADDRESS = env.str("CONTRACT_OWNER_ADDRESS", default='0x78dc5D2D739606d31509C31d654056A45185ECb6')
# WALLET_ADDRESS_OFFSET = env.str("CONTRACT_OWNER_ADDRESS", default=10000000)
# WALLET_ADDRESS_COLLISION_SKIP = env.str("CONTRACT_OWNER_ADDRESS", default=100000000)
