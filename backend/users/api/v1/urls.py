from django.urls import path, include
from rest_framework.routers import DefaultRouter

from users.api.v1.viewsets import UserAdminView, ResetPasswordFormCustom, UserLoginDataView

router = DefaultRouter()
router.register("user-admin", UserAdminView, basename="user-admin")
router.register("user-activity", UserLoginDataView, basename="user-activity")

urlpatterns = [
    path('reset-password/', ResetPasswordFormCustom.as_view(), name='api.reset_password'),
    path("", include(router.urls))
]