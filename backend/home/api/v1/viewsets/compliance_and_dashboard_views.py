import traceback
from decimal import Decimal

from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from celo_humanity.models import Transaction, ACHTransaction
from home.helpers import AuthenticatedAPIView
from home.models.dwolla import DwollaOperation


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
