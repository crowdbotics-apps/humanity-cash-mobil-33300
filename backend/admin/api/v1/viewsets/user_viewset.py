from allauth.account.forms import default_token_generator
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
from home.api.v1.serializers.signup_signin_serializers import VerificationCodeSerializer
from home.helpers import get_user_by_uidb64, AuthenticatedAPIView, setup_verification_code, send_verification_email

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
def password_reset_mobile(request):
    serializer = ResetPasswordSerializer(data=request.data)
    user = User.objects.get(email=request.data.get('email'), is_active=True)
    code = setup_verification_code(user)
    send_verification_email(user, code)
    return Response(
        {'detail': 'Password reset e-mail has been sent.'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
def verify_reset_code(request):
    user = User.objects.get(email=request.data.get('email'), is_active=True)
    request.user = user
    serializer = VerificationCodeSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    user_verification_code = serializer.validated_data
    user_verification_code.active = False
    user = user_verification_code.user
    user.verified_email = True
    user_verification_code.save()
    user.save()
    token = default_token_generator.make_token(user)
    return Response({"token": token}, status=status.HTTP_200_OK)


@api_view(['POST'])
def password_set(request):
    user = User.objects.get(email=request.data.get('email'), is_active=True)
    password = request.data.get('password')
    if user.check_password(password):
        return Response({"password": "The new password cannot be the same as the old one"}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(password)
    user.save()
    request.user = user
    return Response(status=status.HTTP_200_OK)


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
