from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from admin.api.v1.serializers.user_serializer import ResetPasswordSerializer, ResetPasswordConfirmSerializer, \
    UserAdminSerializer, UserDetailAdminSerializer, CustomPasswordResetForm
from home.helpers import get_user_by_uidb64, AuthenticatedAPIView

User = get_user_model()


@api_view(['POST'])
def password_reset(request):
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        form = CustomPasswordResetForm(serializer.data)
        form.is_valid()
        opts = {
            'use_https': request.is_secure(),
            'request': request,
        }
        form.save(**opts)
    return Response(
            {'detail': 'Password reset e-mail has been sent.'},
            status=status.HTTP_200_OK
        )


@api_view(['POST'])
def password_reset_confirm(request):
    ResetPasswordConfirmSerializer.request = request
    serializer = ResetPasswordConfirmSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        user = get_user_by_uidb64(serializer.data['uidb64'])
        user.set_password(serializer.data['new_password1'])
        user.save()
    return Response(
            {'detail': 'Password has been reset with the new password.'},
        )


class UserAdminViewSet(AuthenticatedAPIView, ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserAdminSerializer
    detail_serializer_class = UserDetailAdminSerializer
    search_fields = ["id", "email"]
    filter_backends = [SearchFilter, DjangoFilterBackend]
    http_method_names = ['get', 'head']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            if hasattr(self, 'detail_serializer_class'):
                return self.detail_serializer_class

        return super(UserAdminViewSet, self).get_serializer_class()

