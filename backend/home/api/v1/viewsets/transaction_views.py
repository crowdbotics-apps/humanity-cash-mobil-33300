import base64
from email.mime.image import MIMEImage

from django.conf import settings
from io import BytesIO
import json
import logging
from datetime import datetime
import qrcode

from django.db.models import Q
from rest_framework import mixins
from rest_framework import viewsets, permissions, status
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from base import configs
from celo_humanity.models import Transaction, ACHTransaction
from home.api.v1.cashier_permission import IsNotCashier
from home.api.v1.serializers.transaction_serializers import TransactionSerializer, SendQRSerializer, \
    SendReportSerializer
from home.clients.dwolla_api import DwollaClient
from home.helpers import AuthenticatedAPIView, send_notifications, send_email_with_template_attach_element, \
    send_email_with_template
from users.models import Consumer, Merchant, Notification

logger = logging.getLogger('transaction')


class TransactionViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    queryset = Transaction.objects.filter()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['transaction_id']

    def get_queryset(self):
        qs = super(TransactionViewSet, self).get_queryset()
        if user_id := self.request.GET.get('user', False):
            qs = qs.filter(Q(consumer__user_id=user_id) |
                           Q(merchant__user_id=user_id) |
                           Q(counterpart_consumer__user_id=user_id) |
                           Q(counterpart_merchant__user_id=user_id) )
        return qs

    def get_serializer_class(self):
        res = super(TransactionViewSet, self).get_serializer_class()
        return res


class SendMoneyView(AuthenticatedAPIView):
    permission_classes = [IsAuthenticated & IsNotCashier]

    def post(self, request, *args, **kwargs):
        try:
            body = json.loads(request.body)
            from_is_consumer = body['from_is_consumer']
            to_is_consumer = body['to_is_consumer']

            from_ = (Consumer if from_is_consumer else Merchant).objects.get(pk=body['from'])
            to_ = (Consumer if to_is_consumer else Merchant).objects.get(pk=body['to'])

            if from_ == to_:
                return Response('Source and destination must be different people or profile',
                                status=status.HTTP_400_BAD_REQUEST)

            if from_.user_id != request.user.id:
                return Response('The user does not match with the operation source',
                                status=status.HTTP_400_BAD_REQUEST)

            from_password = body['password']
            amount = float(body.get('amount', 0))
            roundup = float(body.get('roundup', 0))
            if from_.user.check_password(from_password):
                total = amount + roundup
                if amount <= 0 or roundup < 0 or total < 0.01:
                    return Response('Invalid amounts', status=status.HTTP_400_BAD_REQUEST)

                if total > from_.balance:
                    return Response('User balance insufficient for operation', status=status.HTTP_400_BAD_REQUEST)

                from_.transfer(to_, amount, roundup)

                return Response(status=status.HTTP_200_OK)
            else:
                return Response('Invalid password', status=status.HTTP_401_UNAUTHORIZED)

        except (AttributeError, KeyError, ValueError):
            return Response('Invalid request', status=status.HTTP_400_BAD_REQUEST)
        except Merchant.DoesNotExist:
            return Response('Merchant not found', status=status.HTTP_400_BAD_REQUEST)
        except Consumer.DoesNotExist:
            return Response('Consumer not found', status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logger.exception("Error transfering money")
            return Response('Error while transfering, please try again', status=status.HTTP_400_BAD_REQUEST)


class WithdrawView(AuthenticatedAPIView):
    permission_classes = [IsAuthenticated & IsNotCashier]

    def post(self, request, *args, **kwargs):
        try:
            dwolla_client = DwollaClient()
            body = json.loads(request.body)
            user_as_consumer = body['user_as_consumer']
            user_password = body['password']
            user = (Consumer if user_as_consumer else Merchant).objects.get(pk=body['user'])
            amount = float(body.get('amount', 0))

            if user.user.check_password(user_password):
                if amount <= 0:
                    return Response('Invalid amounts', status=status.HTTP_400_BAD_REQUEST)

                if amount > user.balance:
                    return Response('User balance insufficient for operation', status=status.HTTP_400_BAD_REQUEST)

                user.withdraw(amount)

                destination_source = dwolla_client.get_funding_sources_by_customer(user.dwolla_id)
                origin_source = configs.DWOLLA_ACCOUNT_DESTINATION

                transfer = dwolla_client.create_transfer(origin_source, destination_source, amount)
                create_ach_transaction(transfer, True, user)

                return Response(status=status.HTTP_200_OK)
            else:
                return Response('Invalid password', status=status.HTTP_401_UNAUTHORIZED)
        except (AttributeError, KeyError, ValueError):
            return Response('Invalid request', status=status.HTTP_400_BAD_REQUEST)
        except Merchant.DoesNotExist:
            return Response('Merchant not found', status=status.HTTP_400_BAD_REQUEST)
        except Consumer.DoesNotExist:
            return Response('Consumer not found', status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logger.exception("Error withdrawing money")
            return Response('Error while withdrawing, please try again', status=status.HTTP_400_BAD_REQUEST)


class DepositView(AuthenticatedAPIView):
    permission_classes = [IsAuthenticated & IsNotCashier]

    def post(self, request, *args, **kwargs):
        try:
            dwolla_client = DwollaClient()
            body = json.loads(request.body)
            user_as_consumer = body['user_as_consumer']
            user_password = body['password']
            user = (Consumer if user_as_consumer else Merchant).objects.get(pk=body['user'])
            amount = float(body.get('amount', 0))

            if user.user.check_password(user_password):
                if amount <= 0:
                    return Response('Invalid amounts', status=status.HTTP_400_BAD_REQUEST)

                if amount > user.balance:
                    return Response('User balance insufficient for operation', status=status.HTTP_400_BAD_REQUEST)

                origin_source = dwolla_client.get_funding_sources_by_customer(user.dwolla_id)
                destination_source = configs.DWOLLA_ACCOUNT_DESTINATION

                transfer = dwolla_client.create_transfer(destination_source, origin_source, amount)
                create_ach_transaction(transfer, False, user)

                return Response(status=status.HTTP_200_OK)
            else:
                return Response('Invalid password', status=status.HTTP_401_UNAUTHORIZED)
        except (AttributeError, KeyError, ValueError):
            return Response('Invalid request', status=status.HTTP_400_BAD_REQUEST)
        except Merchant.DoesNotExist:
            return Response('Merchant not found', status=status.HTTP_400_BAD_REQUEST)
        except Consumer.DoesNotExist:
            return Response('Consumer not found', status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logger.exception("Error depositing money")
            return Response('Error while depositing, please try again', status=status.HTTP_400_BAD_REQUEST)


def create_ach_transaction(dwolla_trn, withdraw, profile):
    try:
        ach_transaction = ACHTransaction.objects.create(transaction_id=dwolla_trn.id,
                                                        amount=dwolla_trn.amount.value,
                                                        status=ACHTransaction.Status.pending,
                                                        ach_id=dwolla_trn.get("individualAchId", None),
                                                        currency=dwolla_trn.amount.currency,
                                                        created_at=datetime.strptime(dwolla_trn.created,
                                                                                     '%Y-%m-%dT%H:%M:%S.%fZ'),
                                                        customer=profile if profile.is_consumer else None,
                                                        merchant=profile if profile.is_merchant else None,
                                                        type=(
                                                            ACHTransaction.Type.withdraw if withdraw else ACHTransaction.Type.deposit),

                                                        )

        send_notifications([profile.user],
                           'Transaction created',
                           f'The transaction {dwolla_trn.get("individualAchId", dwolla_trn.id)} has started',
                           '',
                           profile.user,
                           Notification.Types.TRANSACTION,
                           ach_transaction=ach_transaction)

    except:
        logger.error(f'Error saving transaction [{dwolla_trn.id}], please contact a system administrator.')


class SendReportView(AuthenticatedAPIView):

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = SendReportSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            start_date = data['start_date']
            end_date = data['start_date']
            user = self.request.user
            transactions = Transaction.objects.filter(
                merchant__user=user,
                created_lte=end_date,
                created__gte=start_date
            )
            send_email_with_template(
                subject='Humanity Cash Report',
                email=user.email,
                template_to_load='emails/transactions.html',
                context={
                    "username": user.get_full_name(),
                    "message": "message",
                    "transactions": transactions,
                }
            )
        except Exception as error:
            logger.exception(error)
            return Response('Error while depositing, please try again', status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


class SendQRView(AuthenticatedAPIView):

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = SendQRSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            image = qrcode.make(json.dumps(data['qr_data']))
            stream = BytesIO()
            image.save(stream, format="png")
            stream.seek(0)
            imgObj = stream.read()
            banner_image = MIMEImage(imgObj)
            banner_image.add_header('Content-ID', '<qr_code.png>')
            send_email_with_template_attach_element(
                context={
                    "username": "Username",
                    "detail": "Detail text",
                    "qr_image": banner_image
                },
                subject='Humanity Cash QR code',
                email=data['email'],
                template_to_load='emails/qr.html',
                image=banner_image
            )
        except Exception as error:
            logger.exception(error)
            return Response('Error sending QR code', status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


