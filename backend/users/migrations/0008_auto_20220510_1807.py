# Generated by Django 3.2.13 on 2022-05-10 18:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cities_light', '0010_auto_20200508_1851'),
        ('users', '0007_consumer_merchant'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consumer',
            name='city',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cities_light.city'),
        ),
        migrations.AlterField(
            model_name='consumer',
            name='state',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cities_light.region'),
        ),
        migrations.AlterField(
            model_name='merchant',
            name='city',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cities_light.city'),
        ),
        migrations.AlterField(
            model_name='merchant',
            name='state',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cities_light.region'),
        ),
    ]
