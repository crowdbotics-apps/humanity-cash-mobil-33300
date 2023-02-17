#!/bin/bash

python3 manage.py migrate
python3 manage.py create_missing_wallets
#python3 manage.py refresh_wallet_addresses
#python3 manage.py refresh_transaction_receipts
