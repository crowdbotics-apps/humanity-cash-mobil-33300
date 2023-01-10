# Generated by Django 3.2.16 on 2023-01-10 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_dwollaoperation'),
    ]

    operations = [
        migrations.CreateModel(
            name='BankAccount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('bank_name', models.CharField(max_length=128)),
                ('description', models.CharField(max_length=512)),
                ('dwolla_account', models.CharField(max_length=200, null=True)),
                ('enabled_credit', models.BooleanField(default=True)),
                ('enabled_debit', models.BooleanField(default=True)),
                ('weigth_adjustment_credits', models.FloatField(default=1.0)),
                ('weigth_adjustment_debits', models.FloatField(default=1.0)),
                ('initial_balance', models.DecimalField(decimal_places=2, max_digits=14, null=True)),
            ],
        ),
    ]