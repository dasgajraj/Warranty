# Generated by Django 5.1.7 on 2025-03-08 07:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Slip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=255)),
                ('user_address', models.TextField()),
                ('ipfs_hash', models.CharField(blank=True, max_length=100, null=True)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('temp_file', models.FileField(null=True, upload_to='temp')),
                ('warranty_start_date', models.DateField()),
                ('warranty_end_date', models.DateField()),
            ],
        ),
    ]
