# Generated by Django 5.1.7 on 2025-03-21 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('slips', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='slip',
            name='owner_wallet',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
