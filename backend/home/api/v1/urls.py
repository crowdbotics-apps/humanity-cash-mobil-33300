from django.urls import path, include
from rest_framework.routers import DefaultRouter
import home.api.v1.viewsets.signup_signin_views as signup_signin_views


# from home.api.v1.viewsets import (
#     # SignupViewSet,
#     # LoginViewSet,
# )


router = DefaultRouter()
# router.register("signup", SignupViewSet, basename="signup")
# router.register("login", LoginViewSet, basename="login")

urlpatterns = [
    path('registration/', include([
        path('set-password/', signup_signin_views.SetPasswordView.as_view(), name='set_password'),
        path('verify-user-account/', signup_signin_views.VerifyUserAccountAPIView.as_view(), name='verify_user_account'),
        path('send-verification-code/', signup_signin_views.ResendVerificationCodeAPIView.as_view(), name='send_verifiction_code'),
    ])),
    path("", include(router.urls))
]
