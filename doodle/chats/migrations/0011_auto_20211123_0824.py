# Generated by Django 3.2.6 on 2021-11-23 02:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chats', '0010_auto_20211123_0736'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Code',
            new_name='Room',
        ),
        migrations.AlterField(
            model_name='chatmessage',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
