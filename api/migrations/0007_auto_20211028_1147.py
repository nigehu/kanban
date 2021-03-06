# Generated by Django 3.2.8 on 2021-10-28 11:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_user_session_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='column',
            name='board',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='api.board'),
        ),
        migrations.AddField(
            model_name='post',
            name='column',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='api.column'),
        ),
        migrations.AlterField(
            model_name='board',
            name='user',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='api.user'),
        ),
        migrations.AlterField(
            model_name='post',
            name='user',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='api.user'),
        ),
    ]
