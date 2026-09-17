from django.db import migrations
from django.core.management import call_command


def run_seed_data(apps, schema_editor):
    try:
        call_command('seed_data')
    except Exception as e:
        print(f"Notice: automatic seed_data execution: {e}")


def reverse_seed_data(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('placement', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(run_seed_data, reverse_code=reverse_seed_data),
    ]
