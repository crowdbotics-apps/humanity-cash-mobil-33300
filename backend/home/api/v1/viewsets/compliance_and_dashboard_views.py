import datetime
import json
import logging
import traceback
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.http import JsonResponse
from rest_framework import status, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base import configs
from celo_humanity.humanity_contract_helpers import get_wallet_balance
from celo_humanity.models import Transaction, ACHTransaction, ComplianceActionSignoff, ComplianceAction
from home.api.v1.serializers.compliance_serializers import ComplianceActionReadSerializer, \
    ComplianceActionCreateSerializer, ComplianceActionSignoffSerializer
from home.helpers import AuthenticatedAPIView
from users.models import Merchant, Consumer

logger = logging.getLogger('compliance')


class DashboardDataView(APIView): #AuthenticatedAPIView):
    # TODO if admin (permission)
    # permission_classes = [IsAuthenticated & IsNotCashier]

    def get(self, request, *args, **kwargs):
        try:
            tokens_minted = Transaction.objects.filter(type=Transaction.Type.deposit).aggregate(
                Sum('amount'))['amount__sum'] or  Decimal(0.0)
            tokens_burned = Transaction.objects.filter(type=Transaction.Type.withdraw).aggregate(
                Sum('amount'))['amount__sum'] or  Decimal(0.0)

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
    permission_classes = [IsAuthenticated] # TODO is admin permission
    # filter_backends = [SearchFilter]
    # search_fields = ['title', 'description']

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
                amount=vdata['ammount'],
                consumer=consumer,
                merchant=merchant,
            )
            ca.signoffs.create(user=user)

        if ca.signoffs.count() >= configs.NECCESARY_COMPLIANCE_SIGNOFFS:  # in case of 1 signoff required
            ca.approve()

            # TODO for now, execute on approval
            ca.execute()

    @action(detail=True, methods=['post'])
    def signoff(self, request, *args, **kwargs):
        # TODO finish
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            action = self.get_object()
            user = request.user
            # password_is_valid = user.check_password(serializer.validated_data['password'])

            if action.status != ComplianceAction.Status.pending:
                raise ValidationError('Action in incorrect state, must be pending for signoff')
            # if not password_is_valid:
            #     raise ValidationError('User password incorrect, signoff not completed')

            action.signoffs.create(user=user)  # may fail due to duplicated signoff

            if action.signoffs.count() >= configs.NECCESARY_COMPLIANCE_SIGNOFFS:
                action.approve()

                # TODO for now, execute on approval
                action.execute()

            return Response(status=status.HTTP_200_OK)

        except (AttributeError, KeyError, ValueError):
            raise ValidationError('Invalid request')
        except (IntegrityError, ValidationError):
            raise ValidationError('Duplicated signoff')
        except Exception:
            logger.exception("Error signing off compliance action")
            raise ValidationError('Error signing off the action, please try again')

    @action(detail=False, methods=['get'])
    def balances(self, request, *args, **kwargs):
        return Response(dict(
            reserve=get_wallet_balance(configs.RESERVE_WALLET_UID),
            positive=get_wallet_balance(configs.POSITIVE_ADJUSTMENT_WALLET_UID),
            negative=get_wallet_balance(configs.NEGATIVE_ADJUSTMENT_WALLET_UID),
        ), status=status.HTTP_200_OK)

