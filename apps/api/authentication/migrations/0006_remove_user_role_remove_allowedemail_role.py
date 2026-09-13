from django.db import migrations, connection


def safe_remove_field(apps, schema_editor):
    """Remove role columns only if they exist (handles case where SQL was run manually)."""
    with connection.cursor() as cursor:
        # Check if role column exists on authentication_user
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'authentication_user' AND column_name = 'role'
        """)
        if cursor.fetchone():
            cursor.execute('ALTER TABLE authentication_user DROP COLUMN role')
        
        # Check if role column exists on authentication_allowedemail
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'authentication_allowedemail' AND column_name = 'role'
        """)
        if cursor.fetchone():
            cursor.execute('ALTER TABLE authentication_allowedemail DROP COLUMN role')


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_user_college_user_usn_alter_user_phone_number'),
    ]

    operations = [
        migrations.RunPython(safe_remove_field, migrations.RunPython.noop),
    ]
