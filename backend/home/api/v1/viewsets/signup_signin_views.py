
from django.core import exceptions
import django.contrib.auth.password_validation as validators
from django.utils import timezone
from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from home.helpers import AuthenticatedAPIView, send_verification_email
import home.api.v1.serializers.signup_signin_serializers as signup_signin_serializers


class SetPasswordView(AuthenticatedAPIView):
    serializer_class = signup_signin_serializers.SetPasswordSerializer

    def post(self, request):
        user = self.request.user
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.data.get("password")
        errors = dict()
        try:
            validators.validate_password(password=password, user=user)
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)
        if errors:
            raise serializers.ValidationError(errors)
        user.set_password(password)
        user.save()
        return Response(status=status.HTTP_200_OK)


class VerifyUserAccountAPIView(AuthenticatedAPIView):
    """
    Endpoint to verify user verification code sent by email
    """
    serializer_class = signup_signin_serializers.VerificationCodeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user_verification_code = serializer.validated_data
        user_verification_code.active = False
        user = user_verification_code.user
        user.verified_email = True
        user_verification_code.save()
        user.save()
        return Response(status=status.HTTP_200_OK)


class ResendVerificationCodeAPIView(AuthenticatedAPIView):
    """
    Endponint to resend verification code by email to the user if this isn't verified yet
    """
    def post(self, request):
        user = self.request.user
        if user.verified_email:
            return Response({"error": "User already verified"}, status=status.HTTP_400_BAD_REQUEST)
        send_verification_email(user)
        return Response(status=status.HTTP_200_OK)
