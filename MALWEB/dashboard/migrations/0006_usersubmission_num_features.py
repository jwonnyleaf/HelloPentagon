# Generated by Django 5.1.2 on 2024-10-26 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_alter_usersubmission_feature_importance_graph'),
    ]

    operations = [
        migrations.AddField(
            model_name='usersubmission',
            name='num_features',
            field=models.IntegerField(default=0),
        ),
    ]