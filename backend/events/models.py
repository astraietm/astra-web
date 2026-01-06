from django.db import models
from django.conf import settings
from django.utils import timezone
import secrets

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    event_date = models.DateTimeField(default=timezone.now)
    venue = models.CharField(max_length=255)
    image = models.URLField(blank=True)
    category = models.CharField(max_length=50)
    
    # Registration Logic
    registration_start = models.DateTimeField(default=timezone.now)
    registration_end = models.DateTimeField(default=timezone.now)
    registration_limit = models.PositiveIntegerField(default=100)
    is_registration_open = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Registration(models.Model):
    STATUS_CHOICES = (
        ('REGISTERED', 'Registered'),
        ('ATTENDED', 'Attended'),
        ('CANCELLED', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='registrations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    timestamp = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    token = models.CharField(max_length=64, unique=True, blank=True, db_index=True)
    
    # Status fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REGISTERED')
    is_used = models.BooleanField(default=False) # Deprecated but kept for backward compat

    def save(self, *args, **kwargs):
        if not self.token:
            while True:
                token = secrets.token_urlsafe(32)
                if not Registration.objects.filter(token=token).exists():
                    self.token = token
                    break
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('user', 'event') # Prevent double registration

    def __str__(self):
        return f"{self.user.email} - {self.event.title} ({self.status})"
