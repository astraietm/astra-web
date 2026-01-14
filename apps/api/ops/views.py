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
        data = {s.key: s.value for s in settings_qs}
        return Response(data)

    def post(self, request):
        for key, value in request.data.items():
            SystemSetting.objects.update_or_create(
                key=key,
                defaults={'value': value}
            )
        
        AuditLog.objects.create(
            user=request.user,
            action="Updated System Settings",
            level="WARN",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        return Response({"status": "success", "message": "Settings updated"})

class IsSuperAdmin(permissions.BasePermission):
    """
    Allocates permissions only to 'ADMIN' role users, filtering out 'VOLUNTEER'.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff and request.user.role == 'ADMIN'

class AllowedEmailListCreateView(generics.ListCreateAPIView):
    from authentication.models import AllowedEmail

    
    # Inline serializer definition to avoid file jumping
    from rest_framework import serializers
    class AllowedEmailSerializer(serializers.ModelSerializer):
        class Meta:
            model = AllowedEmail
            fields = ['id', 'email', 'role', 'added_at']

    queryset = AllowedEmail.objects.all().order_by('-added_at')
    serializer_class = AllowedEmailSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]

    def perform_create(self, serializer):
        instance = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            action=f"Added Team Member",
            details=f"Email: {instance.email}, Role: {instance.role}",
            level="SUCCESS",
            ip_address=self.request.META.get('REMOTE_ADDR')
        )

class AllowedEmailDeleteView(generics.DestroyAPIView):
    from authentication.models import AllowedEmail
    queryset = AllowedEmail.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]

    def perform_destroy(self, instance):
        email = instance.email
        super().perform_destroy(instance)
        AuditLog.objects.create(
            user=self.request.user,
            action=f"Removed Team Member",
            details=f"Email: {email}",
            level="WARN",
            ip_address=self.request.META.get('REMOTE_ADDR')
        )

class NotificationListCreateView(generics.ListCreateAPIView):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def perform_create(self, serializer):
        notification = serializer.save(sent_by=self.request.user)
        subject = notification.subject
        message = notification.message
        recipients_criteria = notification.recipients_criteria
        
        recipient_list = []
        if recipients_criteria == 'All Registered Users':
            recipient_list = list(User.objects.values_list('email', flat=True))
        elif recipients_criteria == 'Admins Only':
            recipient_list = list(User.objects.filter(is_staff=True).values_list('email', flat=True))
        
        if recipient_list:
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list, fail_silently=False)
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

class PublicConfigView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings_qs = SystemSetting.objects.all()
        # Return all settings - in production, filter to only safe keys like 'maintenanceMode'
        data = {s.key: s.value for s in settings_qs}
        return Response(data)
