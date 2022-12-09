# Generated by Django 3.2.15 on 2022-10-08 20:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0025_auto_20221007_1933'),
        ('celo_humanity', '0008_alter_achtransaction_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='achtransaction',
            name='account',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='celo_humanity.account'),
        ),
        migrations.AlterField(
            model_name='achtransaction',
            name='consumer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ach_transactions', to='users.consumer'),
        ),
        migrations.AlterField(
            model_name='achtransaction',
            name='merchant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ach_transactions', to='users.merchant'),
        ),
    ]