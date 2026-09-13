from rest_framework import generics, status, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.conf import settings
import threading
import logging
from .models import AuditLog, SystemSetting, Notification
from .serializers import AuditLogSerializer, SystemSettingSerializer, NotificationSerializer
from authentication.models import User, AllowedEmail

logger = logging.getLogger(__name__)

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



class AllowedEmailListCreateView(generics.ListCreateAPIView):

    class AllowedEmailSerializer(serializers.ModelSerializer):
        class Meta:
            model = AllowedEmail
            fields = ['id', 'email', 'added_at']

    queryset = AllowedEmail.objects.all().order_by('-added_at')
    serializer_class = AllowedEmailSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def create(self, request, *args, **kwargs):
        inviter = request.user
        logger.info(
            f"[TEAM_INVITE_START] Requester={getattr(inviter, 'email', None)}"
        )

        raw_email = request.data.get('email', '')

        # 1. Email validation & sanitization
        if not raw_email or not str(raw_email).strip():
            logger.warning("[TEAM_INVITE_ERR] Empty email address provided")
            return Response(
                {"error": "Please enter a valid email address.", "code": "empty_email"},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = str(raw_email).strip().lower()
        try:
            validate_email(email)
        except ValidationError:
            logger.warning(f"[TEAM_INVITE_ERR] Invalid email syntax: {email}")
            return Response(
                {"error": "Please enter a valid email address.", "code": "invalid_email"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Duplicate checks
        if AllowedEmail.objects.filter(email__iexact=email).exists():
            logger.info(f"[TEAM_INVITE_DUPLICATE] Email {email} already in AllowedEmail list")
            return Response(
                {"error": "An invitation is already pending for this email.", "code": "already_invited"},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_user = User.objects.filter(email__iexact=email).first()
        if existing_user and existing_user.is_staff:
            logger.info(f"[TEAM_INVITE_DUPLICATE] User {email} is already staff")
            return Response(
                {"error": "This user is already a team member.", "code": "already_member"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Create AllowedEmail record
        allowed = AllowedEmail.objects.create(email=email)

        # If user account already exists, promote to staff immediately
        if existing_user:
            existing_user.is_staff = True
            existing_user.save()
            logger.info(f"[TEAM_INVITE_SUCCESS] Upgraded existing user {email} to staff")
        else:
            logger.info(f"[TEAM_INVITE_SUCCESS] Created invitation whitelist entry for {email}")

        # 4. Audit Logging
        AuditLog.objects.create(
            user=inviter,
            action="Added Team Member",
            details=f"Email: {allowed.email}",
            level="SUCCESS",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        # 5. Safe optional invitation notification
        try:
            subject = "Invitation: ASTRA Team Member"
            message = (
                f"Hello,\n\n"
                f"You have been added to the ASTRA operations team.\n\n"
                f"Please access the management portal at https://astraietm.in/admin\n\n"
                f"— ASTRA Security Systems"
            )
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True
            )
        except Exception as mail_err:
            logger.debug(f"[TEAM_INVITE_MAIL_SKIP] Notification email not dispatched: {mail_err}")

        serializer = self.get_serializer(allowed)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AllowedEmailDeleteView(generics.DestroyAPIView):
    queryset = AllowedEmail.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        email = instance.email
        inviter = request.user

        # Prevent admin from locking themselves out
        if email.lower() == getattr(inviter, 'email', '').lower():
            logger.warning(f"[TEAM_DELETE_BLOCKED] Admin {email} attempted self-deletion")
            return Response(
                {"error": "You cannot remove your own administrator account.", "code": "self_delete_forbidden"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delete whitelist entry
        self.perform_destroy(instance)

        # Demote corresponding User if exists and is not superuser
        try:
            user = User.objects.get(email__iexact=email)
            if not user.is_superuser:
                user.is_staff = False
                user.save()
                logger.info(f"[TEAM_DELETE_DEMOTED] Demoted user {email} from staff")
        except User.DoesNotExist:
            pass

        AuditLog.objects.create(
            user=inviter,
            action="Removed Team Member",
            details=f"Email: {email}",
            level="WARN",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

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


class PublicContactView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [] 

    def post(self, request):
        try:
            data = request.data
            name = data.get('name', 'Anonymous')
            email = data.get('email', 'N/A')
            message = data.get('message', 'N/A')
            remote_addr = request.META.get('REMOTE_ADDR')

            def process_background():
                log_entry = None
                try:
                    # 1. Create Initial Audit Log
                    log_entry = AuditLog.objects.create(
                        action="Contact Form Submission",
                        details=f"From: {email} ({name})\nMessage: {message}\nStatus: BUFFERED",
                        level="INFO",
                        ip_address=remote_addr
                    )
                    
                    # 2. Prepare Email
                    subject = f"Astra Secure Uplink: Message from {name}"
                    body = f"Astra Contact Form Submission\n\nUser: {name}\nEmail: {email}\n\nMessage:\n{message}"
                    
                    host_user = getattr(settings, 'EMAIL_HOST_USER', None)
                    recipients = ['contact@astraietm.in']
                    if host_user:
                        recipients.append(host_user)
                    
                    # Log attempt to console for Render logs visibility
                    print(f"DEBUG: Attempting to send email via {settings.EMAIL_HOST}:{settings.EMAIL_PORT} (User: {host_user})")
                    
                    send_mail(
                        subject,
                        body,
                        settings.DEFAULT_FROM_EMAIL,
                        recipients,
                        fail_silently=False
                    )
                    
                    # 3. Update Log on Success
                    log_entry.details += "\nStatus: EMAIL_SENT"
                    log_entry.level = "SUCCESS"
                    log_entry.save()
                    print(f"DEBUG: Email sent successfully to {recipients}")
                    
                except Exception as b_err:
                    error_msg = f"Transmission Error: {str(b_err)}"
                    print(f"DEBUG: {error_msg}")
                    if log_entry:
                        log_entry.details += f"\nStatus: FAILED\nError: {str(b_err)}"
                        log_entry.level = "ERROR"
                        log_entry.save()

            # Start background thread
            t = threading.Thread(target=process_background)
            t.daemon = True
            t.start()

            return Response({
                "status": "success", 
                "message": "Transmission received. Secure link established."
            })
        except Exception as e:
            return Response({
                "status": "success", 
                "message": "Transmission received (buffered)."
            })



