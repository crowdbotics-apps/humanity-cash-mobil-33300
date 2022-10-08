from django.contrib.auth import get_user_model
from rest_framework import serializers

from celo_humanity.models import Transaction

# from rest_auth.serializers import PasswordResetSerializer

User = get_user_model()

class ACHTransactionSerializer(serializers.ModelSerializer):
    from_address = serializers.SerializerMethodField()
    to_address = serializers.SerializerMethodField()
    from_username = serializers.SerializerMethodField()
    to_username = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'created_at', 'ach_id',
            'status', 'type', 'consumer', 'merchant',
            'confirmed_at', 'amount'
        ]
