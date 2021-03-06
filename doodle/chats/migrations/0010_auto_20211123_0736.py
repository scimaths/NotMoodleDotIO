# Generated by Django 3.2.6 on 2021-11-23 02:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0009_auto_20211123_0555'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmessage',
            name='author',
            field=models.TextField(default='abcd'),
        ),
        migrations.AlterField(
            model_name='chatmessage',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='chats.code'),
        ),
    ]
