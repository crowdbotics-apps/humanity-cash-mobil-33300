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
        send_verification_email(user, code)
        return Response(status=status.HTTP_200_OK)


class LoginFacebookView(APIView):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        access_token = data.get('accessToken').get('accessToken')
        try:
            graph = facebook.GraphAPI(access_token=access_token)
            user_info = graph.get_object(
                id='me',
                fields='first_name, last_name, id,'
                       'email, picture.type(large)'
            )
        except facebook.GraphAPIError as e:
            logger.exception('Facebook error: {}'.format(e))
            return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(facebook_id=user_info.get('id')).first()
        if user:
            user.facebook_token = access_token
            user.verified_email = True
            user.save()
        if not user:
            user = User.objects.filter(email=user_info.get('email')).first()
            if user:
                if user.verified_email:
                    user.facebook_id = user_info.get('id')
                    user.facebook_token = access_token
                    user.save()
            else:
                password = User.objects.make_random_password()
                user = User.objects.create(
                    password=password,
                    username=user_info.get('email') or user_info.get('last_name'),
                    first_name='{} {}'.format(user_info.get('first_name'),
                                              user_info.get('middle_name') if user_info.get('middle_name') else ''),
                    last_name=user_info.get('last_name'),
                    is_active=1,
                    email=user_info.get('email') or '{0} without email'.format(user_info.get('last_name')),
                    facebook_id=user_info.get('id'),
                    facebook_token=access_token,
                    verified_email=True
                )

        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        if token:
            userializer = UserDetailSerializer(user)
            return Response(userializer.data, status=status.HTTP_200_OK)
        else:
            return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)


class LoginAppleView(APIView):
    """Continue with apple"""
    authentication_classes = []

    def post(self, request):
        first_name = ''
        last_name = ''
        data = request.data
        identity_token = data.get('identityToken', None)
        full_name = data.get('fullName', None)
        if full_name:
            first_name = full_name.get('givenName', '')
            last_name = full_name.get('familyName', '')
        try:
            decoded = jwt.decode(identity_token, '', verify=False)
        except:
            return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=decoded['email']).first()
        if user:
            user.verified_email = True
            user.save()
        if not user:
            password = User.objects.make_random_password()
            user = User.objects.create(
                password=password,
                username=generate_unique_username([first_name, last_name, decoded['email']]),
                first_name=first_name if first_name else '',
                last_name=last_name if last_name else '',
                is_active=1,
                email=decoded['email'],
                verified_email=True
            )
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        if token:
            userializer = UserDetailSerializer(user)
            return Response(userializer.data, status=status.HTTP_200_OK)
        else:
            return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)


class LoginGoogleView(APIView):
    """Continue with google"""
    authentication_classes = []

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        user_info = data.get('data')
        google_token = data.get('token')
        user = User.objects.filter(google_id=user_info.get('id')).first()
        if user:
            user.google_token = google_token
            user.save()
            if user.profile.blocked:
                return Response('This user is blocked', status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.filter(email=user_info.get('email')).first()
            password = User.objects.make_random_password()
            user = User.objects.create(
                password=password,
                username=generate_unique_username([
                    user_info.get('givenName'),
                    user_info.get('familyName'),
                    user_info.get('email', '')
                ]),
                last_name='{}'.format(user_info.get('familyName')),
                first_name=user_info.get('givenName'),
                is_active=1,
                email=user_info.get('email') or '{0} without email'.format(user_info.get('givenName')),
                google_id=user_info.get('id'),
                google_token=google_token,
            )
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        if token:
            userializer = UserDetailSerializer(user)
            return Response(userializer.data, status=status.HTTP_200_OK)
        else:
            return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)

