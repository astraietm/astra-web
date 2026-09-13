from django.db import migrations


def set_admin_password(apps, schema_editor):
    """Set password for astraietm25@gmail.com and ensure staff/superuser status."""
    User = apps.get_model('authentication', 'User')
    try:
        user = User.objects.get(email__iexact='astraietm25@gmail.com')
    except User.DoesNotExist:
        # Create user if not exists
        from django.contrib.auth.hashers import make_password
        User.objects.create(
            email='astraietm25@gmail.com',
            password=make_password('Notastra@2025'),
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )
        return
    
    from django.contrib.auth.hashers import make_password
    user.password = make_password('Notastra@2025')
    user.is_staff = True
    user.is_superuser = True
    user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0006_remove_user_role_remove_allowedemail_role'),
    ]

    operations = [
        migrations.RunPython(set_admin_password, migrations.RunPython.noop),
    ]
