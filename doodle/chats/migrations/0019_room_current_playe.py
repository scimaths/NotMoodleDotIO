# Generated by Django 3.2.8 on 2021-11-25 22:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0018_auto_20211126_0240'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='current_playe',
            field=models.IntegerField(default=0),
        ),
    ]
