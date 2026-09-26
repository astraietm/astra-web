import logging
from rest_framework import status, generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Registration, Event
from .serializers import RegistrationSerializer, EventSerializer
from .utils import send_registration_email
from django.db.models import Q
from core.permissions import IsAdminUser, IsSuperUser

logger = logging.getLogger(__name__)

class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny] # Public

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny] # Public details


class RegistrationCreateView(generics.CreateAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated] # Protected

    def perform_create(self, serializer):
        # Update user's profile if provided in request
        full_name = self.request.data.get('full_name')
        phone_number = self.request.data.get('phone_number')
        college = self.request.data.get('college')
        
        updated = False
        if full_name and full_name.strip():
            self.request.user.full_name = full_name.strip()
            updated = True
            
        if phone_number and phone_number.strip():
            self.request.user.phone_number = phone_number.strip()
            updated = True
            
        if college and college.strip():
            self.request.user.college = college.strip()
            updated = True
            
        if updated:
            self.request.user.save()
        
        # Automatically set user from JWT
        instance = serializer.save(user=self.request.user)
        if not instance.event.requires_payment:
            instance.status = 'REGISTERED'
            instance.save()
        # Send registration email with ticket
        send_registration_email(instance)

    def create(self, request, *args, **kwargs):
        event_id = request.data.get('event')
        if not event_id:
            return Response({"error": "Event ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        event = get_object_or_404(Event, id=event_id)

        # VALIDATION RULES
        if not event.is_registration_open:
             return Response({"error": "Registration is currently closed."}, status=status.HTTP_400_BAD_REQUEST)
        
        now = timezone.now()
        if now < event.registration_start:
             return Response({"error": f"Registration starts on {event.registration_start}."}, status=status.HTTP_400_BAD_REQUEST)
        
        if event.registration_end > event.registration_start and now > event.registration_end:
             return Response({"error": "Registration deadline has passed."}, status=status.HTTP_400_BAD_REQUEST)

        current_count = event.registrations.count()
        if current_count >= event.registration_limit:
             return Response({"error": "Event is fully booked."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already registered
        if Registration.objects.filter(user=request.user, event_id=event_id).exists():
             return Response(
                 {"error": "You are already registered for this event."},
                 status=status.HTTP_400_BAD_REQUEST
             )
        return super().create(request, *args, **kwargs)

class MyRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Auto-clean any unconfirmed PENDING registrations for paid events
        Registration.objects.filter(
            user=self.request.user,
            status='PENDING',
            event__requires_payment=True
        ).exclude(payment__status='SUCCESS').delete()

        # Only show confirmed registrations (Paid Success OR Free Event)
        return Registration.objects.filter(user=self.request.user).filter(
            Q(event__requires_payment=False) | 
            Q(payment__status='SUCCESS') |
            Q(status__in=['REGISTERED', 'ATTENDED'])
        ).order_by('-timestamp')

class VerifyTokenView(APIView):
    # Depending on requirements, this might need Admin permission
    # per USER request "Admin QR Scan Support", this should ideally be protected.
    # But for simplicity or if the scanner app just has the link, we can keep it open or require Admin.
    # Let's keep it AllowAny for now for easy testing, but in production, we'd use IsAdminUser.
    permission_classes = [permissions.IsAuthenticated, IsAdminUser] 

    def get(self, request, token):
        registration = get_object_or_404(Registration, token=token)
        
        # Check status or is_used
        if registration.status == 'ATTENDED' or registration.is_used:
            return Response({
                "valid": False,
                "message": "QR Code has already been used.",
                "registrant": RegistrationSerializer(registration).data
            }, status=status.HTTP_200_OK) # Return 200 so frontend scanner handles it gracefully

        mark_used = request.query_params.get('mark_used', '').lower() in ['true', '1', 'yes']

        if mark_used:
            # Mark as attended
            registration.status = 'ATTENDED'
            registration.is_used = True
            registration.save()
            return Response({
                "valid": True,
                "message": "Verification successful! Access Granted.",
                "registrant": RegistrationSerializer(registration).data
            }, status=status.HTTP_200_OK)

        # By default (or for check_only), return valid status without modifying DB
        return Response({
            "valid": True,
            "message": "Ticket is valid.",
            "registrant": RegistrationSerializer(registration).data
        }, status=status.HTTP_200_OK)

    def post(self, request, token):
        registration = get_object_or_404(Registration, token=token)

        if registration.status == 'ATTENDED' or registration.is_used:
            return Response({
                "valid": False,
                "message": "QR Code has already been used.",
                "registrant": RegistrationSerializer(registration).data
            }, status=status.HTTP_200_OK)

        registration.status = 'ATTENDED'
        registration.is_used = True
        registration.save()

        return Response({
            "valid": True,
            "message": "Verification successful! Access Granted.",
            "registrant": RegistrationSerializer(registration).data
        }, status=status.HTTP_200_OK)

class AdminRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [IsSuperUser] # Restrict to superusers

    def get_queryset(self):
        # Exclude incomplete PENDING payment registrations from admin list
        return Registration.objects.filter(
            Q(event__requires_payment=False) | 
            Q(payment__status='SUCCESS') |
            Q(status__in=['REGISTERED', 'ATTENDED'])
        ).order_by('-timestamp')

class AdminEventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = [IsAdminUser]

# Payment Views
import razorpay
from django.conf import settings
from .models import Payment
from .serializers import PaymentSerializer
import hmac
import hashlib

class CreatePaymentOrderView(APIView):
    """Create a Razorpay order for event registration or direct checkout"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        event_id = request.data.get('event_id')
        amount_param = request.data.get('amount')
        
        if not getattr(settings, 'RAZORPAY_KEY_ID', '') or not getattr(settings, 'RAZORPAY_KEY_SECRET', ''):
            return Response(
                {"error": "Payment gateway configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        except Exception as e:
            return Response({"error": f"Failed to initialize Razorpay client: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 1. Direct / Generic Order Creation
        if amount_param is not None:
            try:
                amount_in_paise = int(float(amount_param))
            except (ValueError, TypeError):
                return Response({"error": "Invalid amount provided."}, status=status.HTTP_400_BAD_REQUEST)

            if amount_in_paise < 100:
                return Response(
                    {"error": "Minimum order amount must be at least ₹1.00 (100 paise)."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            currency = request.data.get('currency', 'INR')
            receipt = request.data.get('receipt', f"rcpt_{int(timezone.now().timestamp())}")
            notes = request.data.get('notes', {})

            order_data = {
                'amount': amount_in_paise,
                'currency': currency,
                'receipt': str(receipt),
            }
            if notes and isinstance(notes, dict):
                order_data['notes'] = notes

            try:
                razorpay_order = client.order.create(data=order_data)
                return Response({
                    'order_id': razorpay_order['id'],
                    'amount': amount_in_paise,
                    'currency': currency,
                    'key_id': settings.RAZORPAY_KEY_ID,
                    'receipt': razorpay_order.get('receipt', receipt),
                }, status=status.HTTP_201_CREATED)
            except razorpay.errors.AuthenticationError as e:
                return Response({"error": f"Razorpay authentication failed: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)
            except razorpay.errors.BadRequestError as e:
                return Response({"error": f"Razorpay bad request: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Failed to create Razorpay order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 2. Event-based Registration Order
        if not event_id:
            return Response({"error": "Either 'amount' or 'event_id' is required to create an order."}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user or not request.user.is_authenticated:
            return Response({"error": "Authentication required for event registration."}, status=status.HTTP_401_UNAUTHORIZED)

        team_name = request.data.get('team_name', '')
        team_members = request.data.get('team_members', '')
        
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response(
                {"error": f"Event with ID {event_id} was not found in the database."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if event requires payment
        if not event.requires_payment:
            return Response({"error": "This event does not require payment."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already registered
        existing_reg = Registration.objects.filter(user=request.user, event=event).first()
        if existing_reg:
            # If payment exists and is SUCCESS, then it's a real duplicate
            if hasattr(existing_reg, 'payment') and existing_reg.payment.status == 'SUCCESS':
                return Response({"error": "You are already registered for this event."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Otherwise clean up failed/abandoned attempt
            existing_reg.delete()
        
        # Validate registration rules
        if not event.is_registration_open:
            return Response({"error": "Registration is currently closed."}, status=status.HTTP_400_BAD_REQUEST)
        
        now = timezone.now()
        if now < event.registration_start:
            return Response({"error": f"Registration starts on {event.registration_start}."}, status=status.HTTP_400_BAD_REQUEST)
        
        if event.registration_end > event.registration_start and now > event.registration_end:
            return Response({"error": "Registration deadline has passed."}, status=status.HTTP_400_BAD_REQUEST)
        
        current_count = event.registrations.count()
        if current_count >= event.registration_limit:
            return Response({"error": "Event is fully booked."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create registration (pending payment)
        phone_number = request.data.get('phone_number', '')
        college = request.data.get('college', '')
        department = request.data.get('department', '')
        year_of_study = request.data.get('year_of_study', '')
        
        registration = Registration.objects.create(
            user=request.user,
            event=event,
            team_name=team_name,
            team_members=team_members,
            phone_number=phone_number,
            college=college,
            department=department,
            year_of_study=year_of_study,
            status='PENDING'
        )
        
        # Create Razorpay order
        try:
            amount_in_paise = int(float(event.payment_amount) * 100)
            if amount_in_paise < 100:
                registration.delete()
                return Response(
                    {"error": "Minimum order amount must be at least ₹1.00 (100 paise)."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            order_data = {
                'amount': amount_in_paise,
                'currency': 'INR',
                'receipt': f'reg_{registration.id}',
                'notes': {
                    'event_id': event.id,
                    'event_name': event.title,
                    'user_email': request.user.email,
                    'registration_id': registration.id
                }
            }
            
            razorpay_order = client.order.create(data=order_data)
            
            # Create payment record
            payment = Payment.objects.create(
                registration=registration,
                razorpay_order_id=razorpay_order['id'],
                amount=event.payment_amount,
                currency='INR',
                status='PENDING'
            )
            
            return Response({
                'order_id': razorpay_order['id'],
                'amount': amount_in_paise,
                'currency': 'INR',
                'key_id': settings.RAZORPAY_KEY_ID,
                'registration_id': registration.id,
                'event_name': event.title
            }, status=status.HTTP_201_CREATED)
            
        except razorpay.errors.AuthenticationError as e:
            registration.delete()
            return Response({"error": f"Razorpay authentication failed: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)
        except razorpay.errors.BadRequestError as e:
            registration.delete()
            return Response({"error": f"Razorpay bad request: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            registration.delete()
            return Response({"error": f"Failed to create payment order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyPaymentView(APIView):
    """Verify Razorpay payment signature"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return Response(
                {"error": "Missing required payment details (razorpay_order_id, razorpay_payment_id, and razorpay_signature)."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')
        if not secret:
            return Response(
                {"error": "Payment gateway secret configuration missing."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Verify signature using HMAC SHA256: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
        generated_signature = hmac.new(
            secret.encode('utf-8'),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(generated_signature, str(razorpay_signature)):
            # Mark existing database payment as failed if exists
            payment = Payment.objects.filter(razorpay_order_id=razorpay_order_id).first()
            if payment:
                payment.status = 'FAILED'
                payment.save()
                if hasattr(payment, 'registration') and payment.registration:
                    payment.registration.delete()
            return Response({"error": "Payment verification failed: signature mismatch."}, status=status.HTTP_400_BAD_REQUEST)

        # Signature is valid!
        payment = Payment.objects.filter(razorpay_order_id=razorpay_order_id).first()
        if payment:
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.status = 'SUCCESS'
            payment.save()
            
            # Update registration status
            if hasattr(payment, 'registration') and payment.registration:
                registration = payment.registration
                registration.status = 'REGISTERED'
                registration.save()
                
                try:
                    send_registration_email(registration)
                except Exception as email_err:
                    logger.warning(f"Registration email failed: {email_err}")
                
                serializer = RegistrationSerializer(registration)
                return Response({
                    'success': True,
                    'message': 'Payment verified successfully!',
                    'order_id': razorpay_order_id,
                    'payment_id': razorpay_payment_id,
                    'registration': serializer.data
                }, status=status.HTTP_200_OK)

        return Response({
            'success': True,
            'message': 'Payment verified successfully!',
            'order_id': razorpay_order_id,
            'payment_id': razorpay_payment_id
        }, status=status.HTTP_200_OK)

class CancelPaymentView(APIView):
    """Cancel payment and remove pending registration if checkout is closed or fails"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        registration_id = request.data.get('registration_id')
        order_id = request.data.get('order_id')

        reg_filter = Q(user=request.user) & Q(status='PENDING')
        if registration_id:
            reg_filter &= Q(id=registration_id)
        elif order_id:
            reg_filter &= Q(payment__razorpay_order_id=order_id)

        pending_regs = Registration.objects.filter(reg_filter)
        deleted_count = pending_regs.count()
        pending_regs.delete()

        return Response({
            'success': True,
            'message': 'Pending registration cancelled and removed.',
            'deleted_count': deleted_count
        }, status=status.HTTP_200_OK)

class ClearRegistrationsView(APIView):
    permission_classes = [IsSuperUser]

    def delete(self, request):
        try:
            count = Registration.objects.count()
            Registration.objects.all().delete()
            # Also keep payments in sync if needed, mostly handled by CASCADE
            return Response({
                "message": f"Successfully deleted {count} registrations.",
                "deleted_count": count
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SyncEventsView(APIView):
    """Manually trigger event synchronization from management command"""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        try:
            from django.core.management import call_command
            from io import StringIO
            
            # Capture command output
            out = StringIO()
            call_command('sync_events', stdout=out)
            output = out.getvalue()
            
            # Get updated event count
            event_count = Event.objects.count()
            
            return Response({
                "success": True,
                "message": "Events synchronized successfully",
                "event_count": event_count,
                "output": output
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CertificateAttendeesView(APIView):
    """
    GET /api/certificates/attendees/?event_id=<id>

    Staff-only endpoint that returns all registrations with status='ATTENDED'
    for a given event. Used by the certificate generator GitHub Action.

    Response format:
    {
        "event": { id, title, fest_name, event_date, date_str, venue, category },
        "attendees": [
            { registration_id, full_name, email, college, department },
            ...
        ]
    }
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response(
                {"error": "event_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        event = get_object_or_404(Event, id=event_id)

        registrations = Registration.objects.filter(
            event=event,
            status='ATTENDED'
        ).select_related('user')

        # Format event date
        date_str = ''
        if event.event_date:
            date_str = event.event_date.strftime('%-d %B %Y').upper()

        attendees = []
        for reg in registrations:
            user = reg.user
            attendees.append({
                "registration_id": reg.id,
                "full_name": user.full_name or user.email,
                "email": user.email,
                "college": reg.college or getattr(user, 'college', '') or '',
                "department": reg.department or getattr(user, 'department', '') or '',
            })

        return Response({
            "event": {
                "id": event.id,
                "title": event.title,
                "fest_name": "ZERO DAY",  # Update per fest
                "event_date": event.event_date.isoformat() if event.event_date else '',
                "date_str": date_str,
                "venue": event.venue,
                "category": event.category,
            },
            "attendees": attendees,
            "count": len(attendees),
        })
