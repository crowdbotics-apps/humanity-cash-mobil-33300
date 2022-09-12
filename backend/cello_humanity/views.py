# import json
#
# from django.http import JsonResponse
# from django.shortcuts import render
#
# # Create your views here.
# from cello_humanity.humanity_contract_helpers import ContractProxy,  get_humanity_contract
# from cello_humanity.web3helpers import get_provider, get_txn_receipt
#
#
# def get_balance(request):
#     params = request.GET
#     if request.method == 'POST':
#         params = json.loads(request.body)
#     uid = params.get('uid', get_provider().keccak(text=params['name']))
#     return JsonResponse(dict(uid=uid.hex(), balance=get_humanity_contract().proxy.balanceOfWallet(uid)))
#
# def create_wallet(request):
#     params = request.GET
#     if request.method == 'POST':
#         params = json.loads(request.body)
#     uid = params.get('name', None)
#     keccak = get_provider().keccak(text=uid)
#     txn = get_humanity_contract().proxy.newWallet(keccak, transact=True)
#     rcp = get_txn_receipt(txn)
#     wallet = get_humanity_contract().proxy.getWalletAddress(keccak)
#     return JsonResponse(dict(txn=str(txn), rcp=str(rcp), wallet=wallet))
#
#
# def get_wallet(request):
#     params = request.GET
#     if request.method == 'POST':
#         params = json.loads(request.body)
#     uid = params.get('name', None)
#     keccak = get_provider().keccak(text=uid)
#     wallet = get_humanity_contract().proxy.getWalletAddress(keccak)
#     return JsonResponse(dict(uid=keccak.hex(), wallet=wallet))
#
#
#
# def transfer(request):
#     params = request.GET
#     if request.method == 'POST':
#         params = json.loads(request.body)
#     fromd = params.get('from', None)
#     tod = params.get('to', None)
#     amount = int(params.get('amount', None))
#     keccak = get_provider().keccak(text='ertersdst')
#     txn = get_humanity_contract().proxy.transfer(fromd, tod, amount, 0,
#                                                   transact=True,
#                                                   param_types='bytes32,bytes32,uint256,uint256'
#                                                   )
#     rcp = get_txn_receipt(txn)
#     return JsonResponse(dict(txn=str(txn), rcp=str(rcp)))
#
#
# def deposit(request):
#     params = request.GET
#     if request.method == 'POST':
#         params = json.loads(request.body)
#     uid = params.get('uid', get_provider().keccak(text=params['name']))
#     amount = int(params.get('amount', None))
#     txn = get_humanity_contract().proxy.deposit(uid, amount, transact=True)
#     rcp = get_txn_receipt(txn)
#     return JsonResponse(dict(txn=str(txn), rcp=str(rcp)))
#
#
# def withdraw(request):
#     params = request.GET
#     if request.method == 'POST':
#         params = json.loads(request.body)
#     uid = params.get('uid', get_provider().keccak(text=params['name']))
#     amount = int(params.get('amount', None))
#     txn = get_humanity_contract().proxy.withdraw(uid, amount, transact=True)
#     rcp = get_txn_receipt(txn)
#     return JsonResponse(dict(txn=str(txn), rcp=str(rcp)))