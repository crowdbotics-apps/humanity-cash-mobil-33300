# Generated by Django 3.2.15 on 2022-09-20 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('celo_humanity', '0005_transaction_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='transaction_id',
            field=models.CharField(db_index=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='type',
            field=models.CharField(blank=True, choices=[('Withdraw', 'Withdraw'), ('Deposit', 'Deposit'), ('Transfer', 'Transfer'), ('New wallet', 'New Wallet')], max_length=255),
        ),
    ]
