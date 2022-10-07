from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from home.api.v1.serializers.notification_serializers import UserIdPushTokenSerializer
from home.helpers import send_notifications
from users.models import UserDevice, Notification


class SetDeviceView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserIdPushTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        data = serializer.validated_data
        #
        if data['active']:
            devices = UserDevice.objects.filter(device_id=data.get('user_id')).exclude(user=user)
            if devices:
                for device in devices:
                    device.active = False
                    device.save()
            UserDevice.activate_device(user, data.get('user_id'), data.get('push_token'))
        else:
            UserDevice.deactivate_all_devices(user)
        #
        return Response(status=status.HTTP_200_OK)


class NotificationViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(target=self.request.user)

    def get_serializer_class(self):
        return NotificationListSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        serializer = serializer_class(*args, **kwargs)
        return serializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)

        return Response(status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        user = self.request.user
        action = request.data.get('action', Notification.Actions.READ)
        instance = self.get_object()
        if action == Notification.Actions.READ:
            instance.read = True
            instance.save()
        elif action == Notification.Actions.ACCEPT_ACCESS:
            user_requested = instance.from_user
            finplan = instance.finplan
            instance.read = True
            instance.save()
            finplan_user = finplan.finplan_users.filter(user=user_requested).first()
            finplan_user.admin_permission = True
            finplan_user.save()

            send_notifications(
                users=user_requested,
                from_user=user,
                title="{} accepted access request".format(user.username),
                message="Humanity: {} - {} - {}".format(finplan.id, finplan.name, finplan.get_finplan_type_display()),
                notification_type=Notification.Types.ADMIN,
                extra_data=None,
                transaction=None
            )

        elif action == Notification.Actions.REJECT_ACCESS:
            user_requested = instance.from_user
            finplan = instance.finplan
            instance.read = True
            instance.save()

            send_notifications(
                users=user_requested,
                from_user=user,
                title="{} rejected access request".format(user.username),
                message="Finplan: {} - {} - {}".format(finplan.id, finplan.name, finplan.get_finplan_type_display()),
                notification_type=Notification.Types.ADMIN,
                extra_data=None,
                transaction=None
            )

        else:
            Response({'error': 'invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

