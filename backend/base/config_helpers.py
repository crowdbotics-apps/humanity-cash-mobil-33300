#################### No tocar! #########################
################ Magia de configs ######################
# TODO validadores de set ( ejemplo set_HORA_ASD que valide config.HORA_ASD = 5 )

import json
import sys
import threading
import time
from django.apps import apps
from django.db import OperationalError, ProgrammingError

from base.models import Configuration

module_name = 'base.configs'


class ConfigKey:
    def __init__(self, value, verbose_name):
        self.value = value
        self.verbose_name = verbose_name


class ConfigsClass:
    __defaults__ = None
    __config_orm_class__ = None

    def __init__(self, original):
        self.__defaults__ = original
        from base.models import Configuration
        self.__config_orm_class__ = Configuration


        def autocreate():  # crear todos los default
            while True:
                if apps.ready:
                    for attr in self.__defaults__.__dict__:
                        if attr not in self.__dict__ and hasattr(self.__defaults__, attr):
                            try:
                                self.__create_key__(attr)
                            except OperationalError:
                                pass


                    return
                else:
                    time.sleep(0.1)

        th = threading.Thread(target=autocreate)
        th.daemon = True
        th.start()

    def __create_key__(self, item):
        try:
            if hasattr(self.__defaults__, item) and \
                    not self.__config_orm_class__.objects.filter(key=item).exists() and \
                    not (item.startswith('__') and item.endswith('__')):
                try:
                    aux = getattr(self.__defaults__, item)
                    if isinstance(aux, ConfigKey):
                        ret = self.__config_orm_class__.objects.create(
                            key=item, value=json.dumps(aux.value), description=aux.verbose_name
                        )
                    else:
                        ret = self.__config_orm_class__.objects.create(
                            key=item, value=json.dumps(aux), description=item.lower().replace("_", " ").title()
                        )
                    print('creando key ', item)
                    return ret
                except TypeError:
                    pass
        except ProgrammingError:
            print('run migrate on base app')
            aux = getattr(self.__defaults__, item)
            return aux.value if isinstance(aux, ConfigKey) else aux

    def __getattr__(self, item):
        if not apps.ready:
            raise Exception('apps not ready, you should not access to apps yet!')
        if item in self.__dict__ or hasattr(self.__class__, item):
            return self.__dict__[item]

        try:
            # default = getattr(self.__defaults__, item)
            try:
                fromdb = self.__config_orm_class__.objects.get(key=item)
            except Configuration.DoesNotExist:
                fromdb = self.__create_key__(item)
            try:
                if fromdb.image:
                    value = json.loads(fromdb.value)
                    image_url = fromdb.image.url
                    return dict(value=value,image_url=image_url)
                return json.loads(fromdb.value)
            except:
                return fromdb.value
        except:
            print(f'no hay atributo {item}')

        return None

    def __setattr__(self, key, value):
        if hasattr(self, key) and not hasattr(self.__class__, key):
            try:
                self.__getattr__(key)  # forzar creacion
                fromdb = self.__config_orm_class__.objects.get(key=key)
                fromdb.value = json.dumps(value)
                fromdb.save()
            except:
                print(f'key {key} no esta en configs!')
        else:
            super().__setattr__(key, value)


def setup_configs_hooks():
    sys.modules[module_name] = ConfigsClass(sys.modules[module_name])
