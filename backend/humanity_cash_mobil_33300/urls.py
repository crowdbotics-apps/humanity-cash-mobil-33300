"""humanity_cash_mobil_33300 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic.base import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from admin.api.v1.viewsets.user_viewset import verify_reset_code, password_reset, password_reset_confirm,\
    password_reset_mobile, password_set
from home.api.v1.viewsets.dwolla_views import DwollaIAVTemplateView

urlpatterns = [
    # path("", include("home.urls")),
    path("accounts/", include("allauth.urls")),
    # path("modules/", include("modules.urls")),
    path("api/v1/", include("home.api.v1.urls")),
    path("api/v1/admin/", include("admin.api.v1.urls")),
    path("admin/", admin.site.urls),
    path('users/password_reset/', password_reset, name='password_reset'),
    path('users/password_reset_mobile/', password_reset_mobile, name='password_reset_mobile'),
    path('users/verify_reset_code/', verify_reset_code, name='verify_reset_code'),
    path('users/password_set_mobile/', password_set, name='password_set_mobile'),
    path('users/reset/', password_reset_confirm, name='password_reset_confirm_complete'),
    path('users/reset/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
    path("users/", include("users.urls", namespace="users")),
    # Override email confirm to use allauth's HTML view instead of rest_auth's API view
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls'))

]

# Dwolla Instant Account Verification (IAV) page used in the React Native app
# (along with a single-use token that identifies the Dwolla user)
urlpatterns += [path("iav/", DwollaIAVTemplateView.as_view(), name='iav')]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Humanity Cash mobile"
admin.site.site_title = "Humanity Cash mobile Admin Portal"
admin.site.index_title = "Humanity Cash mobile Admin"

# swagger
api_info = openapi.Info(
    title="Humanity Cash mobile API",
    default_version="v1",
    description="API documentation for Humanity Cash mobile App",
)

schema_view = get_schema_view(
    api_info,
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)

urlpatterns += [
    path("api-docs/", schema_view.with_ui("swagger", cache_timeout=0), name="api_docs")
]


urlpatterns += [path("", TemplateView.as_view(template_name='index.html'))]
urlpatterns += [re_path(r"^(?:.*)/?$",
                TemplateView.as_view(template_name='index.html'))]
