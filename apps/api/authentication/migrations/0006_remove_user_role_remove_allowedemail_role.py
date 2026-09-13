from django.db import migrations, connection


def safe_remove_columns(apps, schema_editor):
    """Remove role columns only if they exist (handles case where SQL was run manually)."""
    if connection.vendor == 'sqlite':
        return
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'authentication_user' AND column_name = 'role'
        """)
        if cursor.fetchone():
            cursor.execute('ALTER TABLE authentication_user DROP COLUMN role')

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
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.RemoveField(
                    model_name='user',
                    name='role',
                ),
                migrations.RemoveField(
                    model_name='allowedemail',
                    name='role',
                ),
            ],
            database_operations=[
                migrations.RunPython(safe_remove_columns, migrations.RunPython.noop),
            ],
        ),
    ]
