# accounts/migrations/000X_create_admin_user.py
from django.db import migrations

def create_admin_user(apps, schema_editor):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="123456"   # ⚠️ change this to something secure
        )

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_remove_cart_status_cart_is_active'),  # adjust to latest migration
    ]

    operations = [
        migrations.RunPython(create_admin_user),
    ]
