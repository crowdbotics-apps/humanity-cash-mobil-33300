import itertools
from json import JSONDecodeError

import binascii
import json

from django.conf import settings
from eth_abi.codec import ABICodec
from web3 import Web3
from web3._utils.events import get_event_abi_types_for_decoding
from web3.datastructures import AttributeDict
from web3.exceptions import InvalidEventABI, LogTopicError, MismatchedABI
from web3.providers.auto import load_provider_from_uri
from eth_account import Account
from web3.middleware import construct_sign_and_send_raw_middleware
from web3.middleware import geth_poa_middleware

from typing import Any, Dict, cast, Union, Tuple

from eth_typing import HexStr
from eth_utils import event_abi_to_log_topic, hexstr_if_str, to_bytes
from hexbytes import HexBytes
from web3._utils.abi import get_abi_input_names, get_abi_input_types, map_abi_data, normalize_event_input_types, \
    exclude_indexed_event_inputs, get_indexed_event_inputs
from web3._utils.normalizers import BASE_RETURN_NORMALIZERS
from web3.contract import Contract
from web3.types import EventData, ABIEvent, LogReceipt

web3provider = None


def get_provider():
    global web3provider
    if web3provider is None:
        web3provider = Web3(load_provider_from_uri(settings.CONTRACT_PROVIDER_URL))

        account = Account.from_key(settings.CONTRACT_PRIVATE_KEY) if settings.CONTRACT_PRIVATE_KEY else None
        account = Account.from_mnemonic(settings.CONTRACT_MNEMONIC) if settings.CONTRACT_MNEMONIC else account
        if account:
            web3provider.middleware_onion.inject(geth_poa_middleware, layer=0)
            web3provider.middleware_onion.add(construct_sign_and_send_raw_middleware(account))

        web3provider.eth.default_account = settings.CONTRACT_OWNER_ADDRESS

    return web3provider


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

            method_to_use = method_with_sig if method_with_sig else method

            if kwargs.get('test_contract_call', False):
                del kwargs['test_contract_call']
                return method_to_use(*args, **kwargs)

            if transact:
                return method_to_use(*args, **kwargs).transact()

            return method_to_use(*args, **kwargs).call()

        return wrapper if method else None

    def get_contract(self):
        return self.contract


def get_txn_receipt(txn_hash, **kwargs):
    return get_provider().eth.wait_for_transaction_receipt(txn_hash, **kwargs)


def text2keccak(text):
    return get_provider().keccak(text=text).hex()


def binify(x):
    h = hex(x)[2:].rstrip('L')
    return binascii.unhexlify('0' * (32 - len(h)) + h)


def hextring_object_hook(dictt_or_str):
    if isinstance(dictt_or_str, dict):
        return {hextring_object_hook(k): hextring_object_hook(v) for k, v in dictt_or_str.items()}
    if isinstance(dictt_or_str, list):
        return [hextring_object_hook(e) for e in dictt_or_str]
    if isinstance(dictt_or_str, str):
        if dictt_or_str.startswith('0x'):
            return HexBytes(dictt_or_str)
        return dictt_or_str
    return dictt_or_str


def is_json(myjson):
    try:
        json.loads(myjson)
    except JSONDecodeError:
        return False
    return True


class MyWeb3JsonEncoder(json.JSONEncoder):
    def default(self, obj: Any) -> Union[Dict[Any, Any], HexStr]:
        if isinstance(obj, AttributeDict):
            return {k: v for k, v in obj.items()}
        if isinstance(obj, HexBytes) or isinstance(obj, bytes):
            return HexStr(obj.hex())
        return json.JSONEncoder.default(self, obj)

