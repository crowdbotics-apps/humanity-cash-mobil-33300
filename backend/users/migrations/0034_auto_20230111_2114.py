# Generated by Django 3.2.16 on 2023-01-11 21:14

from django.db import migrations

def create_groups(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.bulk_create([
        Group(name='Employee'),
        Group(name='Supervisor'),
        Group(name='Admin'),
        Group(name='Super Admin'),
    ])

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0033_auto_20221207_1801'),
    ]

    operations = [
        migrations.RunPython(create_groups)
    ]