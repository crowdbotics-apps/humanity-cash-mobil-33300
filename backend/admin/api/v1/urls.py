from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin.api.v1.viewsets.user_viewset import UserAdminViewSet

router = DefaultRouter()

router.register("users", UserAdminViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
]



