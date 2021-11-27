# Generated by Django 3.2.8 on 2021-11-26 11:19

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0023_auto_20211126_1300'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='timer',
        ),
        migrations.AddField(
            model_name='room',
            name='startTime',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='score',
            name='high_score',
            field=models.IntegerField(default=0),
        ),
    ]