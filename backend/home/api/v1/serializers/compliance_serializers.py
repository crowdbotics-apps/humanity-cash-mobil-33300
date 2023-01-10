from decimal import Decimal

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from base import configs
from celo_humanity.models import ComplianceAction
from home.models import DatedSystemBalance, BankAccount, DatedSystemBalanceBankBalances
from users.models import Merchant, Consumer, BaseProfileModel


class ComplianceActionReadSerializer(serializers.ModelSerializer):
    action_from = serializers.SerializerMethodField()
    action_to = serializers.SerializerMethodField()
    signoffs = serializers.SerializerMethodField()
    transaction_id = serializers.SerializerMethodField()
    signable = serializers.SerializerMethodField()
    created_by = serializers.CharField(source='created_by.username')

    class Meta:
        model = ComplianceAction
        fields = [
            'id',
            'status',
            'type',
            'documentation',
            'signoffs',
            'transaction_id',
            'action_from',
            'action_to',
            'amount',
            'created_time',
            'created_by',
            'signable',
        ]

    def get_signable(self, instance):
        request = self.context.get('request')
        return not instance.signoffs.filter(user=request.user).exists()

    def get_signoffs(self, instance):
        return ' and '.join(sgo.user.username for sgo in instance.signoffs.all())

    def get_transaction_id(self, instance):
        if instance.transaction:
            return instance.transaction.transaction_id
        return '---'

    def get_action_from(self, instance):
        if instance.type == ComplianceAction.Type.fund_negative_wallet:
            return f'Reserve wallet ({configs.RESERVE_WALLET_UID})'

        elif instance.type == ComplianceAction.Type.burn_from_negative_wallet:
            return f'Negative Adjustment Wallet ({configs.NEGATIVE_ADJUSTMENT_WALLET_UID})'

        elif instance.type == ComplianceAction.Type.mint_to_positive_wallet:
            return '---'

        elif instance.type == ComplianceAction.Type.transfer_adjustment_to_user:
            return f'Positive Adjustment Wallet ({configs.POSITIVE_ADJUSTMENT_WALLET_UID})'

    def get_action_to(self, instance):
        if instance.type == ComplianceAction.Type.fund_negative_wallet:
            return f'Negative Adjustment Wallet ({configs.NEGATIVE_ADJUSTMENT_WALLET_UID})'

        elif instance.type == ComplianceAction.Type.burn_from_negative_wallet:
            return '---'

        elif instance.type == ComplianceAction.Type.mint_to_positive_wallet:
            return f'Positive Adjustment Wallet ({configs.POSITIVE_ADJUSTMENT_WALLET_UID})'

        elif instance.type == ComplianceAction.Type.transfer_adjustment_to_user:
            if instance.consumer:
                return f'Consumer account ({instance.consumer.crypto_wallet_id})'
            elif instance.merchant:
                return f'Merchant account ({instance.merchant.crypto_wallet_id})'
            else:
                return 'invalid action destination'


class ComplianceActionCreateSerializer(serializers.Serializer):
    documentation = serializers.CharField(min_length=10)
    password = serializers.CharField(min_length=8)
    amount = serializers.DecimalField(6, 2)
    profile_is_consumer = serializers.BooleanField()
    profile_id = serializers.IntegerField(min_value=1, allow_null=True)
    type = serializers.ChoiceField(choices=ComplianceAction.Type.choices)

    class Meta:
        fields = (
            'type',
            'documentation',
            'amount',
            'profile_is_consumer',
            'profile_id',
            'password',
        )

    def validate_amount(self, value):
        if value < Decimal('0.01'):
            raise ValidationError('Invalid ammount')
        return value

    def validate_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise ValidationError('User password is incorrect')
        return value

    def validate(self, attrs):
        if attrs['type'] == ComplianceAction.Type.transfer_adjustment_to_user:
            try:
                profile = (Consumer if attrs['profile_is_consumer'] else Merchant).objects.get(pk=attrs['profile_id'])
                if profile.crypto_wallet_id is None:
                    raise ValidationError('User doesnt have a wallet created, must have wallet to receive coins')
            except (Consumer.DoesNotExist, Merchant.DoesNotExist):
                raise ValidationError('Selected profile not found')
        return attrs


class ComplianceActionSignoffSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=8)

    class Meta:
        fields = ('password',)

    def validate_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise ValidationError('User password is incorrect')
        return value


class ComplianceRecipientSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = Consumer
        fields = [
            'id',
            'is_consumer',
            'label',
        ]

    def get_label(self, instance):
        if instance.is_consumer:
            return f'Cons. {instance.user.name} ({instance.user.email})'
        return f'Merch. {instance.user.name} ({instance.user.email})'


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = [
            'id',
            'name',
        ]


class DatedBalanceSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(source='created')
    banks = serializers.SerializerMethodField()
    details = serializers.SerializerMethodField()

    class Meta:
        model = DatedSystemBalance
        fields = [
            'id',
            'date',
            'comments',
            'banks',
            'tokens_minted',
            'tokens_burned',
            'details',
        ]

    def get_banks(self, _):
        return BankAccountSerializer(instance=BankAccount.objects.order_by('bank_order').all(), many=True).data

    def get_details(self, instance):
        data = DatedBalanceDetailSerializer(instance=instance.balances, many=True).data
        return {row['bank_id']: row for row in data}


class DatedBalanceDetailSerializer(serializers.ModelSerializer):
    bank_id = serializers.IntegerField(source='bank_account_id')

    class Meta:
        model = DatedSystemBalanceBankBalances
        fields = [
            'bank_id',
            'credits_settled',
            'debits_settled',
        ]
