# Generated by Django 3.2.8 on 2021-10-28 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20211028_1147'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='session_id',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
