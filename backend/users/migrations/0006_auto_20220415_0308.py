# Generated by Django 3.2.13 on 2022-04-15 03:08

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20220415_0256'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passwordreset',
            name='expires_on',
            field=models.DateTimeField(default=users.models.code_live_time, verbose_name='Expires On'),
        ),
        migrations.AlterField(
            model_name='userverificationcode',
            name='expires_on',
            field=models.DateTimeField(default=users.models.code_live_time, verbose_name='Expires On'),
        ),
    ]
