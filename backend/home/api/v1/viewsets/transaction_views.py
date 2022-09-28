import json
import logging

from rest_framework import viewsets, permissions, status
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from celo_humanity.models import Transaction
from home.api.v1.cashier_permission import IsNotCashier
from home.api.v1.serializers.transaction_serializers import TransactionSerializer
from home.helpers import AuthenticatedAPIView
from users.models import Consumer, Merchant

logger = logging.getLogger('transaction')

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.filter()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['transaction_id']

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



