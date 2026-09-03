import os
import sys
import getpass
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    print(f"Using User Model: {User._meta.label}")
    
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
    full_name = os.environ.get('DJANGO_SUPERUSER_NAME', 'System Admin')
    
    if not email:
        email = input("Enter Superuser Email: ").strip()
    if not password:
        password = getpass.getpass("Enter Superuser Password: ").strip()
    
    if not email or not password:
        print("Error: Email and password are required.")
        sys.exit(1)
        
    try:
        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(
                email=email,
                password=password,
                full_name=full_name
            )
            print(f"✓ Superuser '{email}' created successfully.")
        else:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            print(f"✓ Superuser '{email}' updated successfully.")
            
    except Exception as e:
        print(f"Error creating superuser: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    create_superuser()
