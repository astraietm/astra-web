from django.db import migrations
from django.contrib.auth.hashers import make_password


def set_admin_password(apps, schema_editor):
    """Set password for astraietm25@gmail.com using raw SQL to avoid model state issues."""
    from django.db import connection
    from django.utils import timezone
    
    hashed = make_password('Notastra@2025')
    now = timezone.now()
    
    with connection.cursor() as cursor:
        # Check if user exists
        cursor.execute(
            "SELECT id FROM authentication_user WHERE LOWER(email) = LOWER(%s)",
            ['astraietm25@gmail.com']
        )
        row = cursor.fetchone()
        
        if row:
            cursor.execute(
                "UPDATE authentication_user SET password = %s, is_staff = true, is_superuser = true WHERE id = %s",
                [hashed, row[0]]
            )
        else:
            cursor.execute("PRAGMA table_info(authentication_user)")
            cols = [c[1] for c in cursor.fetchall()]
            if 'role' in cols:
                cursor.execute(
                    """INSERT INTO authentication_user 
                       (email, password, is_staff, is_superuser, is_active, full_name, phone_number, college, usn, first_name, last_name, date_joined, role) 
                       VALUES (%s, %s, true, true, true, '', '', '', '', '', '', %s, 'ADMIN')""",
                    ['astraietm25@gmail.com', hashed, now]
                )
            else:
                cursor.execute(
                    """INSERT INTO authentication_user 
                       (email, password, is_staff, is_superuser, is_active, full_name, phone_number, college, usn, first_name, last_name, date_joined) 
                       VALUES (%s, %s, true, true, true, '', '', '', '', '', '', %s)""",
                    ['astraietm25@gmail.com', hashed, now]
                )


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0006_remove_user_role_remove_allowedemail_role'),
    ]

    operations = [
        migrations.RunPython(set_admin_password, migrations.RunPython.noop),
    ]
