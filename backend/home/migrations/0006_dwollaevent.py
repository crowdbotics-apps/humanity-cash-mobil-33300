# Generated by Django 3.2.15 on 2022-09-29 04:24

from django.db import migrations, models
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_alter_event_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='DwollaEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('eventId', models.CharField(max_length=200, unique=True)),
                ('topic', models.CharField(max_length=200)),
                ('resourceId', models.CharField(max_length=200)),
                ('resourceLink', models.CharField(max_length=200)),
                ('customerLink', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]