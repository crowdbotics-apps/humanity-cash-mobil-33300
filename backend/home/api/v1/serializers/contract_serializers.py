from django.contrib.auth import get_user_model
from rest_framework import serializers
from celo_humanity.models import Contract



class ContractSerializer(serializers.ModelSerializer):


    class Meta:
        model = Contract
        fields = [
            'id', 'contract_name', 'description', 'deployed_address',
            'version', 'active'
        ]

