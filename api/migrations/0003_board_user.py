# Generated by Django 3.2.8 on 2021-10-13 23:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20211013_2309'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='user',
            field=models.CharField(default='', max_length=50, unique=True),
        ),
    ]
