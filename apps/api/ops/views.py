from rest_framework import generics, status, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.conf import settings
from django.db.models import Q
import threading
import logging
from .models import AuditLog, SystemSetting, Notification
from .serializers import AuditLogSerializer, SystemSettingSerializer, NotificationSerializer
from authentication.models import User, AllowedEmail
from core.permissions import IsAdminUser

logger = logging.getLogger(__name__)

class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        qs = AuditLog.objects.all().order_by('-timestamp')
        
        level = self.request.query_params.get('level')
        if level and level.upper() != 'ALL':
            qs = qs.filter(level__iexact=level)
            
        search = self.request.query_params.get('search')
        if search and search.strip():
            term = search.strip()
            qs = qs.filter(
                Q(action__icontains=term) |
                Q(details__icontains=term) |
                Q(user__email__icontains=term) |
                Q(ip_address__icontains=term)
            )
            
        return qs[:250]

class AuditLogClearView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def delete(self, request):
        count, _ = AuditLog.objects.all().delete()
        AuditLog.objects.create(
            user=request.user,
            action="Cleared System Logs",
            details=f"Purged {count} log entries.",
            level="WARN",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        return Response({"status": "success", "message": f"Cleared {count} log entries."})

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



class TeamListView(APIView):
    """
    GET  /api/ops/team/  → all users with is_superuser=True, is_staff=True, or Admin group
    POST /api/ops/team/  → whitelist email + promote user if exists
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        team_users = User.objects.filter(
            Q(is_staff=True) | Q(is_superuser=True) | Q(groups__name__iexact='Admin')
        ).distinct().order_by('date_joined')

        data = [
            {
                'id': u.id,
                'email': u.email,
                'added_at': u.date_joined,
                'is_superuser': u.is_superuser,
                'is_staff': u.is_staff,
                'groups': list(u.groups.values_list('name', flat=True)),
            }
            for u in team_users
        ]
        return Response(data)

    def post(self, request):
        inviter = request.user
        raw_email = request.data.get('email', '')

        if not raw_email or not str(raw_email).strip():
            return Response(
                {"error": "Please enter a valid email address.", "code": "empty_email"},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = str(raw_email).strip().lower()
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"error": "Please enter a valid email address.", "code": "invalid_email"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if already a staff / superuser / admin group user
        existing_user = User.objects.filter(email__iexact=email).first()
        if existing_user and (existing_user.is_staff or existing_user.is_superuser or existing_user.groups.filter(name__iexact='Admin').exists()):
            return Response(
                {"error": "This user is already a team member.", "code": "already_member"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add to whitelist (ignore duplicate)
        AllowedEmail.objects.get_or_create(email=email)

        # Promote existing user immediately
        if existing_user:
            existing_user.is_staff = True
            existing_user.save()
            logger.info(f"[TEAM_INVITE_SUCCESS] Upgraded existing user {email} to staff")
        else:
            logger.info(f"[TEAM_INVITE_SUCCESS] Whitelisted {email} for staff on first login")

        AuditLog.objects.create(
            user=inviter,
            action="Added Team Member",
            details=f"Email: {email}",
            level="SUCCESS",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        # Send invite email
        try:
            send_mail(
                subject="Invitation: ASTRA Team Member",
                message=(
                    f"Hello,\n\nYou have been added to the ASTRA operations team.\n\n"
                    f"Please access the management portal at https://astraietm.in/admin\n\n"
                    f"— ASTRA Security Systems"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True
            )
        except Exception as mail_err:
            logger.debug(f"[TEAM_INVITE_MAIL_SKIP] {mail_err}")

        return Response(
            {"email": email, "added_at": existing_user.date_joined if existing_user else None},
            status=status.HTTP_201_CREATED
        )

class TeamDeleteView(APIView):
    """
    DELETE /api/ops/team/<user_id>/  → revoke staff/admin status from user + remove from whitelist
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        inviter = request.user

        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Prevent self-removal
        if user.pk == inviter.pk:
            return Response(
                {"error": "You cannot remove your own administrator account.", "code": "self_delete_forbidden"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent removing superusers
        if user.is_superuser:
            return Response(
                {"error": "Cannot remove a superuser account.", "code": "superuser_protected"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Revoke staff and admin groups
        user.is_staff = False
        admin_groups = user.groups.filter(name__iexact='Admin')
        if admin_groups.exists():
            user.groups.remove(*admin_groups)
        user.save()
        logger.info(f"[TEAM_DELETE_DEMOTED] Demoted user {user.email} from staff/admin")

        # Also remove from whitelist if present
        AllowedEmail.objects.filter(email__iexact=user.email).delete()

        AuditLog.objects.create(
            user=inviter,
            action="Removed Team Member",
            details=f"Email: {user.email}",
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
        data = {s.key: s.value for s in settings_qs}
        if "departments" not in data or not data["departments"]:
            data["departments"] = ["CSE", "CY", "EC", "EEE", "ME", "CE", "AD", "MCA", "BSH", "Other"]
        if "semesters" not in data or not data["semesters"]:
            data["semesters"] = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "PG", "Faculty", "Other"]
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



