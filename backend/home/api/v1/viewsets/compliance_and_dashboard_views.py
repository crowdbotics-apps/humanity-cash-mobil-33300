import traceback

from django.db.models import Sum
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response

from celo_humanity.models import Transaction
from home.helpers import AuthenticatedAPIView
from home.models.dwolla import DwollaOperation


class DashboardDataView(AuthenticatedAPIView):
    # TODO if admin (permission)
    # permission_classes = [IsAuthenticated & IsNotCashier]

    def get(self, request, *args, **kwargs):
        try:
            tokens_minted = Transaction.objects.filter(type=Transaction.Type.deposit).aggregate(
                Sum('amount'))['amount__sum']
            tokens_burned = Transaction.objects.filter(type=Transaction.Type.withdraw).aggregate(
                Sum('amount'))['amount__sum']

            deposits_settled = DwollaOperation.objects.filter(
                type=DwollaOperation.Type.DEPOSIT,
                status=DwollaOperation.Status.COMPLETED
            ).aggregate(Sum('amount'))['amount__sum']
            withdrawals_settled = DwollaOperation.objects.filter(
                type=DwollaOperation.Type.WITHDRAW,
                status=DwollaOperation.Status.COMPLETED
            ).aggregate(Sum('amount'))['amount__sum']

            deposits_pending = DwollaOperation.objects.filter(
                type=DwollaOperation.Type.DEPOSIT,
                status=DwollaOperation.Status.PENDING
            ).aggregate(Sum('amount'))['amount__sum']
            withdrawals_pending = DwollaOperation.objects.filter(
                type=DwollaOperation.Type.WITHDRAW,
                status=DwollaOperation.Status.PENDING
            ).aggregate(Sum('amount'))['amount__sum']

            return JsonResponse(
                dict(
                    tokens_minted=tokens_minted,
                    tokens_burned=tokens_burned,
                    tokens_outstanding=tokens_minted - tokens_burned,

                    deposits_settled=deposits_settled,
                    withdrawals_settled=withdrawals_settled,
                    net_deposits=deposits_settled - withdrawals_settled,

                    deposits_pending=deposits_pending,
                    withdrawals_pending=withdrawals_pending,
                ),
                status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
            return Response('Error retriving dashboard info from the database', status=status.HTTP_510_NOT_EXTENDED)
