from base.config_helpers import setup_configs_hooks, ConfigKey

HUMANITY_CHEST_GOAL = ConfigKey(
    value='1000.00',
    verbose_name='Goal of the humanity chest'
)

HUMANITY_CHEST_ACHIEVEMENTS1 = ConfigKey(
    value="0 Families served",
    verbose_name='Humanity chest achievements line 1'
)

HUMANITY_CHEST_ACHIEVEMENTS2 = ConfigKey(
    value="C$ 0 to local farms",
    verbose_name='Humanity chest achievements line 2'
)

DWOLLA_ACCOUNT_DESTINATION = ConfigKey(
    value="https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4",
    verbose_name='Dwolla account destination for withdraw'
)

RESERVE_WALLET_UID = ConfigKey(
    # uid = text2keccak('reserveWallet')
    value="0x4391d0f74f1c34184d68bdbe2a1569ecdd153937e500dd898e80f94da86148af",
    verbose_name='Crypto user id of the compliance reserve wallet'
)

POSITIVE_ADJUSTMENT_WALLET_UID = ConfigKey(
    # uidP = text2keccak('positiveWallet')
    value="0x0d4d8afc7dcebf88d04dcaacdc85bea7527ce28c38ba7b6ab9caa0db558de109",
    verbose_name='Crypto user id of the compliance positive adjustment wallet'
)

NEGATIVE_ADJUSTMENT_WALLET_UID = ConfigKey(
    # uidM = text2keccak('negativeWallet')
    value="0x7e6e5e2fae05fb0010ead4fb3a2f4a2997bf9cbb630d842f181f71a115fe03b4",
    verbose_name='Crypto user id of the compliance negative adjustment wallet'
)

NECCESARY_COMPLIANCE_SIGNOFFS = ConfigKey(
    value=2,
    verbose_name='Number of signoffs required to execute a compliance adjustment operation'
)

# don't touch this!!
setup_configs_hooks()
