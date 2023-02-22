# Generated by Django 3.2.18 on 2023-02-22 12:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('celo_humanity', '0016_transaction_admin_wallet_action'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='achtransaction',
            name='account',
        ),
        migrations.AddField(
            model_name='achtransaction',
            name='crypto_transaction',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ach_transactions', to='celo_humanity.transaction'),
        ),
    ]