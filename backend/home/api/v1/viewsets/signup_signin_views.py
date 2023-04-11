import json
import facebook
import logging

import jwt
from allauth.utils import generate_unique_username
from django.contrib.auth import get_user_model
from django.core import exceptions
import django.contrib.auth.password_validation as validators
from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from home.api.v1.serializers.signup_signin_serializers import UserDetailSerializer
from home.helpers import AuthenticatedAPIView, send_verification_email, setup_verification_code, send_verification_phone
import home.api.v1.serializers.signup_signin_serializers as signup_signin_serializers

User = get_user_model()
logger = logging.getLogger('django')


class SetPasswordView(AuthenticatedAPIView):
    """
    Endpoint to set user password after the sign in
    """
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
        logger.error('Registration ')
        logger.error('email: %s', user.email)
        logger.error('password: %s', password)
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
        code = setup_verification_code(user)
        if user.phone_number:
            send_verification_phone(user, code, user.phone_number)

        send_verification_email(user, code)
        return Response(status=status.HTTP_200_OK)


class LoginFacebookView(APIView):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        access_token = data.get('accessToken')
        try:
            graph = facebook.GraphAPI(access_token=access_token)
            user_info = graph.get_object(
                id='me',
                fields='first_name, last_name, id,'
                       'email, picture.type(large)'
            )
        except facebook.GraphAPIError as e:
            logger.exception('Facebook error: {}'.format(e))
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(facebook_id=user_info.get('id')).first()
        error_msg = 'Please first verify your user to be able to use the login with social networks'
        if user:
            if user.verified_email:
                user.facebook_token = access_token
                user.save()
            else:
                return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
        if not user:
            user = User.objects.filter(email=user_info.get('email')).first()
            if user:
                if user.verified_email:
                    user.facebook_id = user_info.get('id')
                    user.facebook_token = access_token
                    user.save()
                else:
                    return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
            else:
                error_msg = 'User not registered, please first register a user to be able to use the login with social networks'
                return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
        userializer = UserDetailSerializer(user)
        return Response(userializer.data, status=status.HTTP_200_OK)


class LoginAppleView(APIView):

    def post(self, request):
        data = request.data
        identity_token = data.get('identityToken', None)
        try:
            decoded = jwt.decode(
                jwt=identity_token,
                key='',
                algorithms=['HS256'],
                options={
                    "verify_signature": False,
                    "verify_exp": True
                }
            )
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=decoded['email']).first()
        if user:
            if not user.verified_email:
                error_msg = 'Please first verify your user to be able to use the login with social networks'
                return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
        else:
            error_msg = 'User not registered, please first register a user to be able to use the login with social networks'
            return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
        userializer = UserDetailSerializer(user)
        return Response(userializer.data, status=status.HTTP_200_OK)


class LoginGoogleView(APIView):
    """Continue with google"""
    authentication_classes = []

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        user_info = data.get('data')
        google_token = data.get('token')
        user = User.objects.filter(google_id=user_info.get('id')).first()
        error_msg = 'Please first verify your user to be able to use the login with social networks'
        if user:
            if user.verified_email:
                user.google_token = google_token
                user.save()
            else:
                return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
        if not user:
            user = User.objects.filter(email=user_info.get('email')).first()
            if user:
                if user.verified_email:
                    user.google_id = user_info.get('id')
                    user.google_token = google_token
                    user.save()
                else:
                    return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
            else:
                error_msg = 'User not registered, please first register a user to be able to use the login with social networks'
                return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)
        userializer = UserDetailSerializer(user)
        return Response(userializer.data, status=status.HTTP_200_OK)

