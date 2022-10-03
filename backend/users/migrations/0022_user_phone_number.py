# Generated by Django 3.2.15 on 2022-10-03 18:13

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0021_dwollauser'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone_number',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=50, null=True, region=None, verbose_name='Phone Number'),
        ),
    ]
