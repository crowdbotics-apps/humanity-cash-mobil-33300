# Generated by Django 3.2.13 on 2022-06-06 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_user_allow_touch_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='consumer',
            name='dwolla_id',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='merchant',
            name='dwolla_id',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
