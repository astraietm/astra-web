from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('VOLUNTEER', 'Volunteer'),
        ('USER', 'User'),
    )

    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    avatar = models.URLField(blank=True, null=True)
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='USER')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class AllowedEmail(models.Model):
    """
    Emails that are pre-authorized to have specific roles.
    If a user logs in with this email, they typically get the assigned role.
    """
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=User.ROLE_CHOICES, default='VOLUNTEER')
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} ({self.role})"
