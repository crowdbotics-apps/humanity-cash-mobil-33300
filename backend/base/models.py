from django.db import models

from base.utils import picture_upload_dir


def config_upload_dir(instance, filename):
    return picture_upload_dir(instance, "config_images", filename)


class Configuration(models.Model):

    key = models.CharField('Key', max_length=64, unique=True)
    value = models.TextField('Value')
    description = models.TextField('Description', null=True)
    image = models.ImageField(
        blank=True,
        null=True,
        upload_to=config_upload_dir
    )

    

    def __str__(self):
        return "{}: {}".format(self.key, self.value[0:32])

    class Meta:
        ordering = ['key']

    @staticmethod
    def save_value(key, value):
        conf = Configuration.objects.filter(key=key).first()
        if not conf:
            conf = Configuration(key=key)
        conf.value = str(value)
        conf.save()
        return conf

    @staticmethod
    def get_value(key, default=None):
        conf = Configuration.objects.filter(key=key).first()
        if not conf:
            return default
        return conf.value

    @staticmethod
    def delete_value(key):
        conf = Configuration.objects.filter(key=key).first()
        if conf:
            conf.delete()

