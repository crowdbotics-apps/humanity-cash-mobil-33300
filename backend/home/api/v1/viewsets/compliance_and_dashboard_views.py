import logging
import traceback
from decimal import Decimal

from django.conf import settings
from django.db import IntegrityError, transaction
from django.db.models import Sum
from django.http import JsonResponse
from rest_framework import status, mixins, viewsets, filters
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from websockets.exceptions import ConnectionClosedOK

from base import configs
from celo_humanity.humanity_contract_helpers import get_wallet_balance, get_community_balance, get_humanity_balance, \
    NoWalletException, get_wallet, get_redemption_fees, get_roundups_sum, get_community_address, set_community_address, \
    get_humanity_address
from celo_humanity.models import Transaction, ACHTransaction, ComplianceActionSignoff, ComplianceAction
from home.api.v1.serializers.compliance_serializers import ComplianceActionReadSerializer, \
    ComplianceActionCreateSerializer, ComplianceActionSignoffSerializer, ComplianceRecipientSerializer, \
    DatedBalanceSerializer
from home.api.v1.serializers.transaction_serializers import AdminWalletActionSerializer
from home.models import DatedSystemBalance, get_current_system_balance
from home.utils import may_fail
from users import IsProgramManagerSuperAdmin
from users.models import Merchant, Consumer, get_profile_for_crypto_address

logger = logging.getLogger('compliance')


class ComplianceDashboardView(APIView):
    permission_classes = [IsProgramManagerSuperAdmin]

    def get(self, request, *args, **kwargs):
        today = get_current_system_balance()
        balances = [today] + list(DatedSystemBalance.objects.order_by('-created')[:10])
        serializer = DatedBalanceSerializer(instance=balances, many=True)
        return Response(serializer.data)


class AdminWalletDataView(APIView):
    permission_classes = [IsProgramManagerSuperAdmin]

    def get(self, request, *args, **kwargs):
        humanity = get_profile_for_crypto_address(get_humanity_address())
        community = get_profile_for_crypto_address(get_community_address())
        return Response(dict(
            humanity=dict(
                account=str(humanity) if humanity else 'No profile for address',
                balance=get_humanity_balance(),
                income=get_redemption_fees(),
                transfered=sum(
                    Transaction.objects.filter(admin_wallet_action=True).values_list('amount', flat=True)
                ),
            ),
            community_chest=dict(
                account=str(community) if community else 'No profile for address',
                balance=get_community_balance(),
                income=get_roundups_sum(),
            )
        ))

    @may_fail((Consumer.DoesNotExist, Merchant.DoesNotExist), 'Profile not found')
    def post(self, request, *args, **kwargs):
        serializer = AdminWalletActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        klass = Consumer if serializer.validated_data['is_consumer'] else Merchant
        profile = klass.objects.get(pk=serializer.validated_data['id'])
        if serializer.validated_data['action'] == 'community_chest_recipient':
            set_community_address(profile.crypto_wallet_address)
        elif serializer.validated_data['action'] == 'humanity_transfer':
            profile_from = get_profile_for_crypto_address(get_humanity_address())
            if profile_from is None:
                raise ValidationError('Need an account to send a cash out fees transfer')
            profile_from.transfer(profile, serializer.validated_data['amount'], admin_wallet_action=True)
        return Response(status=200)


class DashboardDataView(APIView):
    permission_classes = [IsProgramManagerSuperAdmin]

    def get(self, request, *args, **kwargs):
        try:
            tokens_minted = Transaction.objects.filter(type=Transaction.Type.deposit).aggregate(
                Sum('amount'))['amount__sum'] or Decimal(0.0)
            tokens_burned = Transaction.objects.filter(type=Transaction.Type.withdraw).aggregate(
                Sum('amount'))['amount__sum'] or Decimal(0.0)

            deposits_settled = ACHTransaction.objects.filter(
                type=ACHTransaction.Type.deposit,
                status=ACHTransaction.Status.processed
            ).aggregate(Sum('amount'))['amount__sum'] or Decimal(0.0)
            withdrawals_settled = ACHTransaction.objects.filter(
                type=ACHTransaction.Type.withdraw,
                status=ACHTransaction.Status.processed
            ).aggregate(Sum('amount'))['amount__sum'] or Decimal(0.0)

            deposits_pending = ACHTransaction.objects.filter(
                type=ACHTransaction.Type.deposit,
                status=ACHTransaction.Status.pending
            ).aggregate(Sum('amount'))['amount__sum'] or Decimal(0.0)
            withdrawals_pending = ACHTransaction.objects.filter(
                type=ACHTransaction.Type.withdraw,
                status=ACHTransaction.Status.pending
            ).aggregate(Sum('amount'))['amount__sum'] or Decimal(0.0)

            return JsonResponse(
                dict(
                    tokens_minted=tokens_minted,
                    tokens_burned=tokens_burned,
                    tokens_outstanding=tokens_minted - Decimal(tokens_burned),

                    deposits_settled=deposits_settled,
                    withdrawals_settled=withdrawals_settled,
                    net_deposits=deposits_settled - withdrawals_settled,

                    deposits_pending=deposits_pending,
                    withdrawals_pending=withdrawals_pending,

                    diff_net_outstanding=deposits_settled - withdrawals_settled + tokens_minted - tokens_burned
                ),
                status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
            return Response('Error retriving dashboard info from the database', status=status.HTTP_510_NOT_EXTENDED)


class ComplianceActionViewset(
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.CreateModelMixin,
                    viewsets.GenericViewSet):
    queryset = ComplianceAction.objects.all()
    permission_classes = [IsProgramManagerSuperAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    pagination_class = PageNumberPagination
    search_fields = ['status', 'created_by__username', 'created_by__email', 'documentation']

    def get_queryset(self):
        queryset = super().get_queryset()
        transaction_status = self.request.query_params.get('transaction_status', None)
        if transaction_status is not None:
            queryset = queryset.filter(status=transaction_status)
        return queryset

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return ComplianceActionReadSerializer
        if self.action == 'create':
            return ComplianceActionCreateSerializer
        if self.action == 'signoff':
            return ComplianceActionSignoffSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        vdata = serializer.validated_data
        type = vdata['type']
        consumer = vdata['profile_id'] if type == ComplianceAction.Type.transfer_adjustment_to_user and vdata['profile_is_consumer'] else None
        merchant = vdata['profile_id'] if type == ComplianceAction.Type.transfer_adjustment_to_user and not vdata['profile_is_consumer'] else None
        with transaction.atomic():
            ca = ComplianceAction.objects.create(
                type=type,
                documentation=vdata['documentation'],
                created_by=user,
                amount=vdata['amount'],
                consumer_id=consumer,
                merchant_id=merchant,
            )
            ca.pre_check_action()
            # ca.signoffs.create(user=user)

        result = 'created'
        # if ca.signoffs.count() >= configs.NECCESARY_COMPLIANCE_SIGNOFFS:  # in case of 1 signoff required
        #     ca.approve()
        #
        #     # TODO for now, execute on approval
        #     result = 'executed' if ca.execute() else 'failed'

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def signoff(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            action = self.get_object()
            user = request.user
            password_is_valid = user.check_password(serializer.validated_data['password'])

            if action.status != ComplianceAction.Status.pending:
                raise ValidationError('Action in incorrect state, must be pending for signoff')
            if not password_is_valid:
                raise ValidationError('User password incorrect, signoff not completed')

            action.signoffs.create(user=user)  # may fail due to duplicated signoff

            result = 'signed'
            if action.signoffs.count() >= configs.NECCESARY_COMPLIANCE_SIGNOFFS:
                action.approve()

                # TODO for now, execute on approval
                result = 'executed' if action.execute() else 'failed'

            return Response(result, status=status.HTTP_200_OK)

        except (AttributeError, KeyError, ValueError):
            raise ValidationError('Invalid request')
        except (IntegrityError, ValidationError):
            raise ValidationError('Duplicated signoff')
        except Exception:
            logger.exception("Error signing off compliance action")
            raise ValidationError('Error signing off the action, please try again')

    @action(detail=False, methods=['get'])
    def balances(self, request, *args, **kwargs):
        try:
            return Response(dict(
                reserve=get_wallet_balance(configs.RESERVE_WALLET_UID),
                positive=get_wallet_balance(configs.POSITIVE_ADJUSTMENT_WALLET_UID),
                negative=get_wallet_balance(configs.NEGATIVE_ADJUSTMENT_WALLET_UID),
                community=get_community_balance(),
                humanity=get_humanity_balance(),

                reserve_link=settings.BLOCKCHAIN_EXPLORER_LINK_TEMPLATE.format(
                    address=get_wallet(configs.RESERVE_WALLET_UID)
                ),
                positive_link=settings.BLOCKCHAIN_EXPLORER_LINK_TEMPLATE.format(
                    address=get_wallet(configs.POSITIVE_ADJUSTMENT_WALLET_UID)
                ),
                negative_link=settings.BLOCKCHAIN_EXPLORER_LINK_TEMPLATE.format(
                    address=get_wallet(configs.NEGATIVE_ADJUSTMENT_WALLET_UID)
                ),
            ), status=status.HTTP_200_OK)
        except (TimeoutError, NoWalletException, RuntimeError, ConnectionClosedOK) as error:
            logger.exception('Contract Error: {}'.format(error))
            return Response(dict(
                reserve='-',
                positive='-',
                negative='-',
                community='-',
                humanity='-',
            ), status=status.HTTP_200_OK)


class ComplianceRecipientSearchViewset(viewsets.GenericViewSet):
    serializer_class = ComplianceRecipientSerializer
    permission_classes = [IsProgramManagerSuperAdmin]
    filter_backends = [SearchFilter]
    search_fields_consumer = ['user__username', 'user__name', 'user__email', 'crypto_wallet_id']
    search_fields_merchant = ['user__username', 'user__name', 'user__email', 'crypto_wallet_id', 'business_name']
    search_fields = []

    def list(self, request, *args, **kwargs):
        self.search_fields = self.search_fields_consumer
        list_consumer = self.filter_queryset(Consumer.objects.all())
        self.search_fields = self.search_fields_consumer
        list_merchant = self.filter_queryset(Merchant.objects.all())

        serializer = self.get_serializer(list(list_consumer[:15]) + list(list_merchant[:15]), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def lists(self, request, *args, **kwargs):
        self.search_fields = self.search_fields_consumer
        list_consumer = self.filter_queryset(Consumer.objects.all())
        self.search_fields = self.search_fields_consumer
        list_merchant = self.filter_queryset(Merchant.objects.all())

        return Response(dict(
            consumers=self.get_serializer(list(list_consumer[:15]), many=True).data,
            merchants=self.get_serializer(list(list_merchant[:15]), many=True).data,
        ))
