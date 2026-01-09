from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .models import AuditLog, SystemSetting, Notification
from .serializers import AuditLogSerializer, SystemSettingSerializer, NotificationSerializer
from authentication.models import User

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

class SystemSettingListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        settings_qs = SystemSetting.objects.all()
        serializer = SystemSettingSerializer(settings_qs, many=True)
        # Convert list to dict for frontend easier consumption { key: value }
        # But for now, let's return list structure as requested by previous frontend mockup style which likely expects a mapped object or array
        # Let's return a dictionary of key-values for easier frontend consumption
        data = {s.key: s.value for s in settings_qs}
        return Response(data)

    def post(self, request):
        # Expects a dict of { key: value }
        for key, value in request.data.items():
            SystemSetting.objects.update_or_create(
                key=key,
                defaults={'value': value}
            )
        
        # Log action
        AuditLog.objects.create(
            user=request.user,
            action="Updated System Settings",
            level="WARN",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        return Response({"status": "success", "message": "Settings updated"})

class NotificationListCreateView(generics.ListCreateAPIView):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def perform_create(self, serializer):
        notification = serializer.save(sent_by=self.request.user)
        
        # Send Email Logic
        subject = notification.subject
        message = notification.message
        recipients_criteria = notification.recipients_criteria
        
        recipient_list = []
        if recipients_criteria == 'All Registered Users':
            recipient_list = list(User.objects.values_list('email', flat=True))
        elif recipients_criteria == 'Admins Only':
            recipient_list = list(User.objects.filter(is_staff=True).values_list('email', flat=True))
        # Add more logic as needed
        
        if recipient_list:
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    recipient_list,
                    fail_silently=False,
                )
                AuditLog.objects.create(
                    user=self.request.user,
                    action=f"Sent Notification Blast: {subject}",
                    details=f"Recipients: {len(recipient_list)}",
                    level="SUCCESS",
                    ip_address=self.request.META.get('REMOTE_ADDR')
                )
            except Exception as e:
                AuditLog.objects.create(
                    user=self.request.user,
                    action=f"Failed to Send Notification: {subject}",
                    details=str(e),
                    level="ERROR",
                    ip_address=self.request.META.get('REMOTE_ADDR')
                )
