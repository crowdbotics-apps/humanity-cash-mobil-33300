import base64
from decimal import Decimal
from email.mime.image import MIMEImage

from django.conf import settings
from io import BytesIO
import json
import logging
from datetime import datetime
import qrcode

from django.db.models import Q
from rest_framework import mixins, filters
from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from celo_humanity.humanity_contract_helpers import calculate_redemption_fee
from celo_humanity.models import Transaction, ACHTransaction
from home.api.v1.cashier_permission import IsNotCashier, IsCashier
from home.api.v1.serializers.ach_transaction_serializers import ACHTransactionSerializer
from home.api.v1.serializers.transaction_serializers import TransactionSerializer, SendQRSerializer, \
    SendReportSerializer, TransactionMobileSerializer
from home.clients.dwolla_api import DwollaClient, NoFundingSourceException
from home.helpers import AuthenticatedAPIView, send_notifications, send_email_with_template_attach_element, \
    send_email_with_template
from home.models.bank import choose_bank_account_for_transaction
from home.utils import may_fail
from users.models import Consumer, Merchant, Notification

logger = logging.getLogger('transaction')


class TransactionViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['transaction_id']

    def get_queryset(self):
        qs = super(TransactionViewSet, self).get_queryset()
        user = self.request.user
        is_merchant = self.request.query_params.get('selected_account', 'merchant')
        if not user.role and not user.is_superuser:
            if is_merchant == 'merchant':
                qs = qs.filter(merchant=self.request.user.get_merchant_data)
            else:
                qs = qs.filter(consumer=self.request.user.get_consumer_data)
        if user_id := self.request.GET.get('user', False):
            qs = qs.filter(Q(consumer__user_id=user_id) |
                           Q(merchant__user_id=user_id) |
                           Q(counterpart_consumer__user_id=user_id) |
                           Q(counterpart_merchant__user_id=user_id))
        return qs

    @action(detail=True, methods=['post'])
    def show_detail_data(self, request, *args, **kwargs):
        try:
            transaction = self.get_object()
            serializer = self.get_serializer(instance=transaction, context={'request': request})
            data = serializer.data
            return Response(data, status=status.HTTP_200_OK)
        except (AttributeError, KeyError, ValueError):
            raise ValidationError('Invalid request')


class TransactionMobileViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    serializer_class = TransactionMobileSerializer

    @may_fail(KeyError, 'Invalid request')
    @may_fail((Merchant.DoesNotExist, Consumer.DoesNotExist), 'User profile not found')
    def list(self, request, *args, **kwargs):
        klass = dict(consumer=Consumer, merchant=Merchant)[request.query_params['selected_account']]
        profile = klass.objects.get(user=request.user)

        blockchain_transactions = Transaction.objects.exclude(type=Transaction.Type.new_wallet)
        ach_transactions = ACHTransaction.objects.filter(status=ACHTransaction.Status.pending)
        if profile.is_merchant:
            blockchain_transactions = blockchain_transactions.filter(Q(merchant=profile) | Q(counterpart_merchant=profile))
            ach_transactions = ach_transactions.filter(merchant=profile)
        else:
            blockchain_transactions = blockchain_transactions.filter(Q(consumer=profile) | Q(counterpart_consumer=profile))
            ach_transactions = ach_transactions.filter(consumer=profile)

        serializer = self.get_serializer(
            list(ach_transactions) + list(blockchain_transactions),
            many=True,
            main_profile=profile
        )
        return Response(serializer.data)


class SendReturnTransactionView(APIView):
    permission_classes = [IsCashier | IsAuthenticated]

    # @may_fail(Exception, 'Error while transfering, please try again')
    @may_fail((AttributeError, KeyError, ValueError), 'Invalid request')
    @may_fail((Merchant.DoesNotExist, Consumer.DoesNotExist), 'User profile not found')
    @may_fail(Transaction.DoesNotExist, 'Transaction not found')
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        trn_id = body['transaction_id']

        from_ = Merchant.objects.get(user=request.user)
        original_transaction = Transaction.objects.get(pk=trn_id)
        to_ = original_transaction.profile

        if from_ != original_transaction.counterpart_profile:
            raise ValidationError('The transaction does not belongs to the current merchant')

        if from_ == to_:
            raise ValidationError('Source and destination must be different people or profile')

        amount = float(body.get('amount', 0))

        if amount < 0.1:
            raise ValidationError('Invalid amount')

        if amount > from_.balance:
            raise ValidationError('User balance insufficient for operation')

        if amount > original_transaction.balance_left_to_return:
            raise ValidationError('Amount to refund is greater than the amount left to refund in original transaction')

        from_.transfer(to_, amount, 0, original_transaction=original_transaction)

        return Response(status=status.HTTP_200_OK)


class SendMoneyView(AuthenticatedAPIView):
    permission_classes = [IsAuthenticated & IsNotCashier]

    # @may_fail(Exception, 'Error while transfering, please try again')
    @may_fail((AttributeError, KeyError, ValueError), 'Invalid request')
    @may_fail((Merchant.DoesNotExist, Consumer.DoesNotExist), 'User profile not found')
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        from_is_consumer = body['from_is_consumer']
        to_is_consumer = body['to_is_consumer']

        from_ = (Consumer if from_is_consumer else Merchant).objects.get(pk=body['from'])
        to_ = (Consumer if to_is_consumer else Merchant).objects.get(pk=body['to'])

        if from_ == to_:
            raise ValidationError('Source and destination must be different people or profile')

        if from_.user_id != request.user.id:
            raise ValidationError('The user does not match with the operation source')

        from_password = body['password']
        amount = float(body.get('amount', 0))
        roundup = float(body.get('roundup', 0))
        # if from_.user.check_password(from_password) or from_password is None:
        total = amount + roundup
        if amount <= 0 or roundup < 0 or total < 0.1:
            raise ValidationError('Invalid amounts')

        if total > from_.balance:
            raise ValidationError('User balance insufficient for operation')

        from_.transfer(to_, amount, roundup)

        return Response(status=status.HTTP_200_OK)
        # else:
        #    return Response('Invalid password', status=status.HTTP_401_UNAUTHORIZED)


class WithdrawView(AuthenticatedAPIView):
    permission_classes = [IsAuthenticated & IsNotCashier]

    # @may_fail(Exception, 'Error while withdrawing, please try again')
    @may_fail((AttributeError, KeyError, ValueError), 'Invalid request')
    @may_fail((Merchant.DoesNotExist, Consumer.DoesNotExist), 'User profile not found')
    def post(self, request, *args, **kwargs):
        dwolla_client = DwollaClient()
        body = json.loads(request.body)
        user_as_consumer = body['user_as_consumer']
        user_password = body.get('password', '')
        user = (Consumer if user_as_consumer else Merchant).objects.get(pk=body['user'])
        amount = float(body.get('amount', 0))

        #if user.user.check_pasword(user_password):
        if amount <= 0:
            raise ValidationError('Invalid amounts')

        if amount > user.balance:
            raise ValidationError('User balance insufficient for operation')

        if user.is_consumer and amount > 5:
            raise ValidationError('Maximum amount for withdraw: 5 C$')

        transaction = user.withdraw(amount)

        amount -= float(calculate_redemption_fee(amount))

        destination_source = dwolla_client.get_funding_sources_by_customer(user.dwolla_id)
        bank_account = choose_bank_account_for_transaction(credit=False)
        origin_source = bank_account.dwolla_account
        if not len(destination_source):
            raise ValidationError('User doesn´t have a funding source attached')

        transfer = dwolla_client.create_transfer(origin_source, destination_source[0]['id'], amount)
        create_ach_transaction(transfer, True, user, bank_account, transaction)

        return Response(status=status.HTTP_200_OK)
        #else:
        #    return Response('Invalid password', status=status.HTTP_401_UNAUTHORIZED)


class DepositView(AuthenticatedAPIView):
    permission_classes = [IsAuthenticated & IsNotCashier]

    # @may_fail(Exception, 'Error while depositing, please try again')
    @may_fail((AttributeError, KeyError, ValueError), 'Invalid request')
    @may_fail((Merchant.DoesNotExist, Consumer.DoesNotExist), 'User profile not found')
    def post(self, request, *args, **kwargs):
        dwolla_client = DwollaClient()
        body = json.loads(request.body)
        user_as_consumer = body['user_as_consumer']
        user_password = body['password']
        user = (Consumer if user_as_consumer else Merchant).objects.get(pk=body['user'])
        amount = float(body.get('amount', 0))

        # if user.user.check_password(user_password):
        if amount <= 0:
            raise ValidationError('Invalid amounts')

        if amount > user.balance:
            raise ValidationError('User balance insufficient for operation')

        origin_source = dwolla_client.get_funding_sources_by_customer(user.dwolla_id)
        bank_account = choose_bank_account_for_transaction(credit=True)
        destination_source = bank_account.dwolla_account
        if not len(destination_source):
            raise ValidationError('User doesn´t have a funding source attached')

        transfer = dwolla_client.create_transfer(origin_source[0]['id'], destination_source, amount)
        create_ach_transaction(transfer, False, user, bank_account)

        return Response(status=status.HTTP_200_OK)
        # else:
        #     return Response('Invalid password', status=status.HTTP_401_UNAUTHORIZED)


def create_ach_transaction(dwolla_trn, withdraw, profile, bank_account, transaction = None):
    try:
        ach_transaction = ACHTransaction.objects.create(transaction_id=dwolla_trn.id,
                                                        amount=dwolla_trn.amount.value,
                                                        status=ACHTransaction.Status.pending,
                                                        ach_id=dwolla_trn.get("individualAchId", None),
                                                        currency=dwolla_trn.amount.currency,
                                                        created_at=datetime.strptime(dwolla_trn.created,
                                                                                     '%Y-%m-%dT%H:%M:%S.%fZ'),
                                                        consumer=profile if profile.is_consumer else None,
                                                        merchant=profile if profile.is_merchant else None,
                                                        type=(
                                                            ACHTransaction.Type.withdraw if withdraw else ACHTransaction.Type.deposit),
                                                        bank_account=bank_account,
                                                        crypto_transaction=transaction
                                                        )

        send_notifications([profile.user],
                           'Transaction created',
                           f'The transaction {dwolla_trn.get("individualAchId", dwolla_trn.id)} has started',
                           '',
                           profile.user,
                           Notification.Types.TRANSACTION,
                           ach_transaction=ach_transaction)

    except:
        logger.exception(f'Error saving transaction [{dwolla_trn.id}], please contact a system administrator.')


class SendReportView(AuthenticatedAPIView):
    @may_fail(Merchant.DoesNotExist, 'INVALID REQUEST')
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = SendReportSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            start_date = datetime(
                year=data['start_date'].year,
                month=data['start_date'].month,
                day=data['start_date'].day,
            )
            end_date = datetime(
                year=data['end_date'].year,
                month=data['end_date'].month,
                day=data['end_date'].day,
            )
            user = self.request.user

            profile = Merchant.objects.get(user=user)

            transactions = Transaction.objects.filter(Q(counterpart_merchant__user=user) | Q(merchant__user=user))
            transactions = transactions.filter(
                created__lte=end_date,
                created__gte=start_date
            )
            for transaction in transactions:
                if transaction.transaction_is_credit(profile):
                    transaction.amount_format = 'C$ +' + str(transaction.amount)
                else:
                    transaction.amount_format = 'C$ -' + str(transaction.amount)

            send_email_with_template(
                subject='Humanity Cash Transaction Report',
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
            if data['qr_data']['to_is_consumer']:
                username = Consumer.objects.get(id=data['qr_data']['to']).user.username
            else:
                username = Merchant.objects.get(id=data['qr_data']['to']).business_name
            send_email_with_template_attach_element(
                context={
                    "username": username,
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
