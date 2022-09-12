from cello_humanity.models import Contract, Transaction
from cello_humanity.web3helpers import get_txn_receipt, get_provider
from web3.exceptions import BadFunctionCallOutput

#
# def get_humanity_contract():
#     return get_contract(settings.CONTRACT_ADDRESS, get_contract_abi('Controller'))
#
#
# contract_proxy = None
#
#
# def get_humanity_contract_helper():
#     global contract_proxy
#     if contract_proxy is None:
#         contract_proxy = ContractProxy(get_humanity_contract())
#     return contract_proxy


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


def get_wallet(uid, create=True):
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
                receipt=str(rcp),
                crypto_wallet_id=uid,
            )
        else:
            raise NoWalletException()
    # TODO wrap exceptions

    return get_humanity_contract().proxy.getWalletAddress(uid)


def get_wallet_balance(uid, param_types='bytes32'):
    amount = get_humanity_contract().proxy.balanceOfWallet(uid,param_types=param_types)
    # TODO wrap exceptions
    return crypto2usd(amount)


def transfer_coin(from_uid, to_uid, amount, roundup_amount):
    txn = get_humanity_contract().proxy.transfer(from_uid,
                                                 to_uid,
                                                 usd2crypto(amount),
                                                 usd2crypto(roundup_amount),
                                                 transact=True,
                                                 param_types='bytes32,bytes32,uint256,uint256'
                                                 )
    rcp = get_txn_receipt(txn)

    Transaction.objects.create(
        contract = get_humanity_contract(),
        transaction_id= txn.hex(),
        method_or_memo=f'transfer {amount} from user {from_uid} to user {to_uid}, roundup {roundup_amount}',
        receipt=str(rcp),
        crypto_wallet_id=from_uid,
        counterpart_crypto_wallet_id=to_uid,
    )

    # TODO wrap exceptions
    return True


def withdraw_coin(from_uid, amount):
    txn = get_humanity_contract().proxy.withdraw(from_uid,
                                                 usd2crypto(amount),
                                                 transact=True,
                                                 )
    rcp = get_txn_receipt(txn)

    Transaction.objects.create(
        contract = get_humanity_contract(),
        transaction_id= txn.hex(),
        method_or_memo=f'withdraw (burn) {amount} from user {from_uid}',
        receipt=str(rcp),
        crypto_wallet_id=from_uid,
    )
    # TODO wrap exceptions
    return True


def deposit_coin(to_uid, amount):
    txn = get_humanity_contract().proxy.deposit(to_uid,
                                                usd2crypto(amount),
                                                transact=True,
                                                )
    rcp = get_txn_receipt(txn)

    Transaction.objects.create(
        contract=get_humanity_contract(),
        transaction_id=txn.hex(),
        method_or_memo=f'deposit (mint) {amount} to user {to_uid}',
        receipt=str(rcp),
        crypto_wallet_id=to_uid,
    )
    # TODO wrap exceptions
    return True


def get_humanity_balance():
    wallet = get_humanity_contract().proxy.humanityCashAddress()
    return get_wallet_balance(wallet, param_types='address')


def get_community_balance():
    wallet = get_humanity_contract().proxy.communityChestAddress()
    return get_wallet_balance(wallet, param_types='address')