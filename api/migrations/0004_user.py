# Generated by Django 3.2.8 on 2021-10-14 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_board_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(default='', max_length=100, unique=True)),
                ('first_name', models.CharField(default='', max_length=100, unique=True)),
                ('last_name', models.CharField(default='', max_length=100, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
