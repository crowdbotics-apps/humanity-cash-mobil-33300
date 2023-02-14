import binascii
import json

from django.conf import settings
from web3 import Web3, AsyncHTTPProvider
from web3.providers.auto import load_provider_from_uri
from eth_account import Account
from web3.middleware import construct_sign_and_send_raw_middleware
from web3.middleware import geth_poa_middleware

from typing import Any, Dict, cast, Union

from eth_typing import HexStr
from eth_utils import event_abi_to_log_topic
from hexbytes import HexBytes
from web3._utils.abi import get_abi_input_names, get_abi_input_types, map_abi_data
from web3._utils.normalizers import BASE_RETURN_NORMALIZERS
from web3.contract import Contract


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

            if kwargs.get('test_contract_call', False):
                del kwargs['test_contract_call']
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



class EventLogDecoder:
    def __init__(self, contract: Contract):
        self.contract = contract
        self.event_abis = [abi for abi in self.contract.abi if abi['type'] == 'event']
        self._sign_abis = {event_abi_to_log_topic(abi): abi for abi in self.event_abis}
        self._name_abis = {abi['name']: abi for abi in self.event_abis}
    def decode_log(self, result: Dict[str, Any]):
        data = [t[2:] for t in result['topics']]
        data += [result['data'][2:]]
        data = "0x" + "".join(data)
        return self.decode_event_input(data)
    def decode_event_input(self, data: Union[HexStr, str], name: str = None) -> Dict[str, Any]:
        # type ignored b/c expects data arg to be HexBytes
        data = HexBytes(data)  # type: ignore
        selector, params = data[:32], data[32:]
        if name:
            func_abi = self._get_event_abi_by_name(event_name=name)
        else:
            func_abi = self._get_event_abi_by_selector(selector)
        names = get_abi_input_names(func_abi)
        types = get_abi_input_types(func_abi)
        decoded = self.contract.web3.codec.decode(types, cast(HexBytes, params))
        normalized = map_abi_data(BASE_RETURN_NORMALIZERS, types, decoded)
        return dict(zip(names, normalized))
    def _get_event_abi_by_selector(self, selector: HexBytes) -> Dict[str, Any]:
        try:
            return self._sign_abis[selector]
        except KeyError:
            raise ValueError("Event is not presented in contract ABI.")
    def _get_event_abi_by_name(self, event_name: str) -> Dict[str, Any]:
        try:
            return self._name_abis[event_name]
        except KeyError:
            raise KeyError(f"Event named '{event_name}' was not found in contract ABI.")
