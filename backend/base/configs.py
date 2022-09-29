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


# don't touch this!!
setup_configs_hooks()
