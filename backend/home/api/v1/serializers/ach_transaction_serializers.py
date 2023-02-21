from django.contrib.auth import get_user_model
from rest_framework import serializers

from celo_humanity.models import Transaction, ACHTransaction

# from rest_auth.serializers import PasswordResetSerializer
from home.api.v1.serializers.setup_profile_serializers import ConsumerProfileDetailSerializer, MerchantMyProfileSerializer

User = get_user_model()

class ACHTransactionSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    consumer_data = serializers.SerializerMethodField()
    merchant_data = serializers.SerializerMethodField()

    class Meta:
        model = ACHTransaction
        fields = [
            'id', 'transaction_id', 'created_at', 'ach_id', 'status', 'type', 'consumer', 'merchant', 'confirmed_at',
            'amount', 'consumer_data', 'merchant_data'
        ]

    def get_status(self, obj):
        status = obj.status
        if obj.status == ACHTransaction.Status.processed:
            status = "completed"
        return status

    def get_consumer_data(self, obj):
        if obj.get_consumer_data:
            return ConsumerProfileDetailSerializer().to_representation(obj.get_consumer_data)
        return None

    def get_merchant_data(self, obj):
        if obj.get_merchant_data:
            return MerchantMyProfileSerializer().to_representation(obj.get_merchant_data)
        return None