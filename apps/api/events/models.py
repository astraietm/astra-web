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
    time = models.CharField(max_length=100, blank=True, help_text="e.g. 11:00 AM")
    duration = models.CharField(max_length=100, blank=True, help_text="e.g. 2 Hours")
    
    # Registration Logic
    registration_start = models.DateTimeField(default=timezone.now)
    registration_end = models.DateTimeField(default=timezone.now)
    registration_limit = models.PositiveIntegerField(default=100)
    is_registration_open = models.BooleanField(default=True)
    
    # Team Logic
    is_team_event = models.BooleanField(default=False)
    team_size_min = models.PositiveIntegerField(default=1)
    team_size_max = models.PositiveIntegerField(default=1)
    
    # Payment Logic
    requires_payment = models.BooleanField(default=False)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Amount in INR")
    
    # Structured Content (Modern Layout Support)
    content_blocks = models.JSONField(default=list, blank=True, help_text="List of {title, content, list[], items[]} for premium rendering")
    coordinators = models.JSONField(default=list, blank=True, help_text="List of {name, phone, role}")
    prize = models.CharField(max_length=255, blank=True, help_text="Prize pool amount or description")
    
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
    
    # Team Data
    team_name = models.CharField(max_length=255, blank=True)
    team_members = models.TextField(blank=True, help_text="Comma separated names or JSON")

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

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    )
    
    registration = models.OneToOneField(Registration, on_delete=models.CASCADE, related_name='payment')
    razorpay_order_id = models.CharField(max_length=255, blank=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True)
    razorpay_signature = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment {self.razorpay_order_id} - {self.status}"
