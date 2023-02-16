from django.contrib.auth import get_user_model
from rest_framework import serializers

from celo_humanity.humanity_contract_helpers import get_humanity_contract
from celo_humanity.models import Contract



class ContractSerializer(serializers.ModelSerializer):
    active = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = [
            'id', 'contract_name', 'description', 'deployed_address',
            'version', 'active'
        ]

    def get_active(self, instance):
        status = get_humanity_contract().proxy.paused()
        return not status