from django.urls import path, include
from rest_framework.routers import DefaultRouter

from users.api.v1.viewsets import UserAdminView

router = DefaultRouter()
router.register("user-admin", UserAdminView, basename="user-admin")

urlpatterns = [
    path("", include(router.urls))
]