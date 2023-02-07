import functools
import json

from celo_humanity.models import Contract, Transaction
from celo_humanity.web3helpers import get_txn_receipt, get_provider
from web3.exceptions import BadFunctionCallOutput
from web3 import Web3


class NoWalletException(Exception):
    ...


class WalletAlreadyCreatedException(Exception):
    ...


def get_humanity_contract():
    return Contract.objects.filter(contract_name='Controller', active=True).get()


def crypto2usd(crypto_amount):
    return get_provider().fromWei(crypto_amount, 'ether')


def usd2crypto(usd_amount):
    return get_provider().toWei(usd_amount, 'ether')


def fromandto_to_kwargs(profile=None, counterpart_profile=None):
    return dict(
        consumer=profile if profile and profile.is_consumer else None,
        merchant=profile if profile and profile.is_merchant else None,
        counterpart_consumer=counterpart_profile if counterpart_profile and counterpart_profile.is_consumer else None,
        counterpart_merchant=counterpart_profile if counterpart_profile and counterpart_profile.is_merchant else None
    )


@functools.lru_cache(maxsize=None)
def uid_to_wallet(uid):
    return get_wallet(uid, create=False)


def get_wallet(uid, create=True, profile=None):
    try:
        return get_humanity_contract().proxy.getWalletAddress(uid)
    except BadFunctionCallOutput:
        if create:
            txn = get_humanity_contract().proxy.newWallet(uid, transact=True)
            rcp = get_txn_receipt(txn)

            Transaction.objects.create(
                contract=get_humanity_contract(),
                transaction_id=txn.hex(),
                method_or_memo=f'create wallet to user {uid}',
                receipt=Web3.toJSON(rcp),
                crypto_wallet_id=uid,
                type=Transaction.Type.new_wallet,
                **fromandto_to_kwargs(profile)
            )
        else:
            # raise NoWalletException()
            return None
    return get_humanity_contract().proxy.getWalletAddress(uid)


def get_wallet_balance(uid, param_types='bytes32'):
    if param_types == 'bytes32':
        get_wallet(uid, create=False)
    amount = get_humanity_contract().proxy.balanceOfWallet(uid, param_types=param_types)
    # TODO wrap exceptions
    return crypto2usd(amount)


def transfer_coin(from_uid, to_uid, amount, roundup_amount, profile, counterpart_profile):
    txn = get_humanity_contract().proxy.transfer(from_uid,
                                                 to_uid,
                                                 usd2crypto(amount),
                                                 usd2crypto(roundup_amount),
                                                 transact=True,
                                                 param_types='bytes32,bytes32,uint256,uint256'
                                                 )
    rcp = get_txn_receipt(txn)

    transaction = Transaction.objects.create(
        contract=get_humanity_contract(),
        transaction_id=txn.hex(),
        method_or_memo=f'transfer {amount} from user {from_uid} to user {to_uid}, roundup {roundup_amount}',
        receipt=Web3.toJSON(rcp),
        crypto_wallet_id=from_uid,
        amount=amount,
        counterpart_crypto_wallet_id=to_uid,
        type=Transaction.Type.transfer,
        **fromandto_to_kwargs(profile, counterpart_profile)
    )

    # TODO wrap exceptions
    return transaction


def burn_coin(from_uid, amount, profile=None):
    return withdraw_coin(from_uid, amount, profile, action_name='burn')


def withdraw_coin(from_uid, amount, profile=None, action_name='withdraw (burn)'):
    txn = get_humanity_contract().proxy.withdraw(from_uid,
                                                 usd2crypto(amount),
                                                 transact=True,
                                                 )
    rcp = get_txn_receipt(txn)

    transaction = Transaction.objects.create(
        contract=get_humanity_contract(),
        transaction_id=txn.hex(),
        amount=amount,
        method_or_memo=f'{action_name} {amount} from user {from_uid}',
        receipt=Web3.toJSON(rcp),
        crypto_wallet_id=from_uid,
        type=Transaction.Type.withdraw,
        **fromandto_to_kwargs(profile)
    )
    # TODO wrap exceptions
    return transaction


def mint_coin(to_uid, amount, profile=None):
    return deposit_coin(to_uid, amount, profile, action_name='mint')


def deposit_coin(to_uid, amount, profile=None, action_name='deposit (mint)'):
    txn = get_humanity_contract().proxy.deposit(to_uid,
                                                usd2crypto(amount),
                                                transact=True,
                                                )
    rcp = get_txn_receipt(txn)

    transaction = Transaction.objects.create(
        contract=get_humanity_contract(),
        transaction_id=txn.hex(),
        amount=amount,
        method_or_memo=f'{action_name} {amount} to user {to_uid}',
        receipt=Web3.toJSON(rcp),
        crypto_wallet_id=to_uid,
        type=Transaction.Type.deposit,
        **fromandto_to_kwargs(counterpart_profile=profile)
    )
    # TODO wrap exceptions
    return transaction


def get_humanity_balance():
    wallet = get_humanity_contract().proxy.humanityCashAddress()
    return get_wallet_balance(wallet, param_types='address')


def get_humanity_userid():
    return get_humanity_contract().proxy.HUMANITY_CASH()


def get_community_balance():
    wallet = get_humanity_contract().proxy.communityChestAddress()
    return get_wallet_balance(wallet, param_types='address')


def get_transaction_confirmations(txn_id):
    try:
        return get_provider().eth.blockNumber - get_txn_receipt(txn_id).blockNumber + 1
    except:
        return -1
