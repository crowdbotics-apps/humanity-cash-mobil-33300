# Generated by Django 3.2.14 on 2022-09-08 14:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0004_event_link'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='event',
            options={'ordering': ['start_date']},
        ),
    ]
