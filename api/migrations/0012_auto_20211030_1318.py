# Generated by Django 3.2.8 on 2021-10-30 13:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20211029_1318'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='user',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='api.user'),
        ),
        migrations.AlterField(
            model_name='post',
            name='assigned',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.user'),
        ),
    ]