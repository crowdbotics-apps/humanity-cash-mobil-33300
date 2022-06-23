# Generated by Django 3.2.13 on 2022-06-21 02:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_alter_merchant_industry'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='facebook_id',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Facebook ID'),
        ),
        migrations.AddField(
            model_name='user',
            name='facebook_token',
            field=models.TextField(blank=True, null=True, verbose_name='Facebook Token'),
        ),
    ]