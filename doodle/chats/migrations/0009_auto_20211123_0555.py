# Generated by Django 3.2.6 on 2021-11-23 00:25

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0008_alter_code_room_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chatmessage',
            old_name='chat',
            new_name='room',
        ),
        migrations.RemoveField(
            model_name='chatmessage',
            name='nick',
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='author',
            field=models.TextField(default='abcd'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='code',
            name='room_code',
            field=models.CharField(default='', max_length=6),
        ),
    ]