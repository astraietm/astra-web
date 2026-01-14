from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    LEVEL_CHOICES = [
        ('INFO', 'Info'),
        ('WARN', 'Warning'),
        ('ERROR', 'Error'),
        ('SUCCESS', 'Success'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='INFO')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp} - {self.action}"

class SystemSetting(models.Model):
    key = models.CharField(max_length=50, unique=True)
    value = models.JSONField(default=dict) # Store boolean or strings as JSON for flexibility
    description = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key

class Notification(models.Model):
    PRIORITY_CHOICES = [
        ('NORMAL', 'Normal'),
        ('URGENT', 'Urgent'),
        ('SUCCESS', 'Success'),
    ]

    subject = models.CharField(max_length=255)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='NORMAL')
    recipients_criteria = models.CharField(max_length=50) # e.g. "All Users", "Admins"
    sent_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject
