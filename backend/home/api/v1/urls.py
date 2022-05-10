from django.urls import path, include
from rest_framework.routers import DefaultRouter
import home.api.v1.viewsets.signup_signin_views as signup_signin_views


# from home.api.v1.viewsets import (
#     # SignupViewSet,
#     # LoginViewSet,
# )
from home.api.v1.viewsets import setup_profile_views, base_views

router = DefaultRouter()
# router.register("signup", SignupViewSet, basename="signup")
# router.register("login", LoginViewSet, basename="login")

urlpatterns = [
    path('registration/', include([
        path('set-password/', signup_signin_views.SetPasswordView.as_view(), name='set_password'),
        path('verify-user-account/', signup_signin_views.VerifyUserAccountAPIView.as_view(), name='verify_user_account'),
        path('send-verification-code/', signup_signin_views.ResendVerificationCodeAPIView.as_view(), name='send_verifiction_code'),
    ])),
    path('set-up-profile/', include([
        path('consumer/', setup_profile_views.SetupConsumerProfileAPIView.as_view(), name='setup_consumer_profile'),
        path('consumer-detail/', setup_profile_views.SetupConsumerProfileDetailAPIView.as_view(), name='setup_consumer_profile_detail'),
        path('merchant/', setup_profile_views.SetupMerchantProfileAPIView.as_view(), name='setup_merchant_profile'),
        path('merchant-detail/', setup_profile_views.SetupMerchantProfileDetailAPIView.as_view(), name='setup_merchant_profile_detail'),
    ])),
    path('base/', include([
        path('cities/', base_views.CityListView.as_view(), name='cities'),
        path('states/', base_views.StateListView.as_view(), name='states'),
    ])),
    path("", include(router.urls))
]
