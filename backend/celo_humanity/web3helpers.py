import binascii
import json

from django.conf import settings
from web3 import Web3, AsyncHTTPProvider
from web3.providers.auto import load_provider_from_uri
from eth_account import Account
from web3.middleware import construct_sign_and_send_raw_middleware
from web3.middleware import geth_poa_middleware

web3provider = None


def get_provider():
    global web3provider
    if web3provider is None:
        web3provider = Web3(load_provider_from_uri(settings.CONTRACT_PROVIDER_URL))

        if settings.CONTRACT_PRIVATE_KEY:
            account = Account.from_key(settings.CONTRACT_PRIVATE_KEY)
            web3provider.middleware_onion.inject(geth_poa_middleware, layer=0)
            web3provider.middleware_onion.add(construct_sign_and_send_raw_middleware(account))
        elif settings.CONTRACT_MNEMONIC:
            account = Account.from_mnemonic(settings.CONTRACT_MNEMONIC)
            web3provider.middleware_onion.inject(geth_poa_middleware, layer=0)
            web3provider.middleware_onion.add(construct_sign_and_send_raw_middleware(account))

        web3provider.eth.default_account = settings.CONTRACT_OWNER_ADDRESS

    return web3provider


# def get_contract_abi(contract_name):
#     with open(f'{settings.CONTRACTS_ARTIFACTS_FOLDER}/{contract_name}_metadata.json', 'r') as fi:
#         metadata = json.loads(fi.read(int(1e9)))
#         return metadata['output']['abi']


def get_contract(contract_address, abi):
    return get_provider().eth.contract(abi=abi, address=contract_address)


class ContractProxy(object):
    def __init__(self, contract):
        self.contract = contract

    def __getattr__(self, item):
        method = getattr(self.contract.functions, item)

        def wrapper(*args, transact=False, signature=None, param_types=None, **kwargs):
            method_with_sig = None
            if param_types:
                method_with_sig = self.contract.get_function_by_signature(signature=f'{item}({param_types})')
            if signature:
                method_with_sig = self.contract.get_function_by_signature(signature=signature)

            if kwargs.get('testi', False):
                del kwargs['testi']
                return (method_with_sig if method_with_sig else method)(*args, **kwargs)

            if transact:
                return (method_with_sig if method_with_sig else method)(*args, **kwargs).transact()

            return (method_with_sig if method_with_sig else method)(*args, **kwargs).call()
        return wrapper if method else None

    def get_contract(self):
        return self.contract


def get_txn_receipt(txn_hash):
    return get_provider().eth.wait_for_transaction_receipt(txn_hash)

def text2keccak(text):
    return get_provider().keccak(text=text).hex()

def binify(x):
    h = hex(x)[2:].rstrip('L')
    return binascii.unhexlify('0'*(32-len(h))+h)