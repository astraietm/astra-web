import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    print(f"Using User Model: {User._meta.label}")
    
    email = 'admin@astra.in'
    password = 'admin'
    
    try:
        # Check if user exists
        if not User.objects.filter(email=email).exists():
            # Create new superuser
            # Note: create_superuser helper usually expects username_field as first arg
            # We explicitly pass email as it is our USERNAME_FIELD
            user = User.objects.create_superuser(
                email=email,
                password=password,
                full_name='System Admin'
            )
            print(f"Superuser created successfully.")
        else:
            # Update existing user
            print(f"User {email} already exists. Resetting password and permissions...")
            user = User.objects.get(email=email)
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            print(f"Superuser updated successfully.")
            
        print(f"--------------------------------------------------")
        print(f"Admin Panel URL: http://127.0.0.1:8000/admin/")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print(f"--------------------------------------------------")
        
    except Exception as e:
        print(f"Error creating superuser: {str(e)}")

if __name__ == '__main__':
    create_superuser()
