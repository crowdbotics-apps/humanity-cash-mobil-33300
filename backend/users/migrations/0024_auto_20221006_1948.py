# Generated by Django 3.2.15 on 2022-10-06 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0023_alter_merchant_business_story'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='merchant',
            name='owner_address_1',
        ),
        migrations.RemoveField(
            model_name='merchant',
            name='owner_address_2',
        ),
        migrations.RemoveField(
            model_name='merchant',
            name='owner_city',
        ),
        migrations.RemoveField(
            model_name='merchant',
            name='owner_state',
        ),
        migrations.RemoveField(
            model_name='merchant',
            name='owner_zip_code',
        ),
        migrations.AlterField(
            model_name='merchant',
            name='city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='merchant',
            name='state',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
    ]
