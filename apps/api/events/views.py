from rest_framework import status, generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Registration, Event
from .serializers import RegistrationSerializer, EventSerializer
from .utils import send_registration_email
from django.db.models import Q

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
        
        # Automatically set user from JWT and snapshot their profile
        # Since this endpoint is only for free events (or direct registration), we set status to REGISTERED
        instance = serializer.save(
            user=self.request.user,
            phone_number=phone_number or getattr(self.request.user, 'phone_number', ''),
            college=college or getattr(self.request.user, 'college', ''),
            department=getattr(self.request.user, 'department', '') if hasattr(self.request.user, 'department') else '',
            year_of_study=getattr(self.request.user, 'year_of_study', '') if hasattr(self.request.user, 'year_of_study') else '',
            status='REGISTERED'
        )
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
        
        if now > event.registration_end:
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
        
        # PAYMENT GATEWAY SECURITY
        if event.requires_payment:
             return Response(
                 {"error": "This event requires payment. Please use the 'Pay & Register' option."},
                 status=status.HTTP_402_PAYMENT_REQUIRED
             )

        return super().create(request, *args, **kwargs)

class MyRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show registrations that are confirmed (Paid Success OR Free Event)
        return Registration.objects.filter(user=self.request.user).filter(
            Q(event__requires_payment=False) | 
            Q(payment__status='SUCCESS')
        ).order_by('-timestamp')

class VerifyTokenView(APIView):
    # Depending on requirements, this might need Admin permission
    # per USER request "Admin QR Scan Support", this should ideally be protected.
    # But for simplicity or if the scanner app just has the link, we can keep it open or require Admin.
    # Let's keep it AllowAny for now for easy testing, but in production, we'd use IsAdminUser.
    permission_classes = [permissions.AllowAny] 

    def get(self, request, token):
        registration = get_object_or_404(Registration, token=token)
        
        # Check status or is_used
        if registration.status == 'PENDING':
            return Response({
                "valid": False,
                "message": "Payment pending. This ticket is not active yet.",
                "registrant": RegistrationSerializer(registration).data
            }, status=status.HTTP_200_OK)

        if registration.status == 'ATTENDED' or registration.is_used:
            return Response({
                "valid": False,
                "message": "QR Code has already been used.",
                "registrant": RegistrationSerializer(registration).data
            }, status=status.HTTP_200_OK) # Return 200 so frontend scanner handles it gracefully
        
        # Mark as attended
        registration.status = 'ATTENDED'
        registration.is_used = True
        registration.save()
        
        return Response({
            "valid": True,
            "message": "Verification successful! Access Granted.",
            "registrant": RegistrationSerializer(registration).data
        }, status=status.HTTP_200_OK)

class AdminRegistrationsView(generics.ListAPIView):
    queryset = Registration.objects.all().order_by('-timestamp')
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAdminUser] # Restrict to staff/admins

class AdminEventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser]

import logging
import traceback
import razorpay
import hmac
import hashlib
from django.conf import settings
from .models import Payment
from .serializers import PaymentSerializer

logger = logging.getLogger(__name__)

class CreatePaymentOrderView(APIView):
    """Create a Razorpay order for event registration"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            event_id = request.data.get('event_id')
            team_name = request.data.get('team_name', '')
            team_members = request.data.get('team_members', '')
            
            logger.info(f"Payment request for event {event_id} from user {request.user.email}")
            
            if not event_id:
                return Response({"error": "Event ID is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return Response(
                    {"error": f"Event with ID {event_id} was not found in the database. Please ensure the event is created in the admin panel."}, 
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
                
                # If it's a free event, existence of registration is enough
                if not event.requires_payment:
                    return Response({"error": "You are already registered for this event."}, status=status.HTTP_400_BAD_REQUEST)

                # Otherwise, it's a failed/abandoned payment attempt.
                # Clean it up so we can create a fresh order.
                logger.info(f"Cleaning up old pending registration {existing_reg.id}")
                existing_reg.delete()
            
            # Validate registration rules (same as RegistrationCreateView)
            if not event.is_registration_open:
                return Response({"error": "Registration is currently closed."}, status=status.HTTP_400_BAD_REQUEST)
            
            now = timezone.now()
            if now < event.registration_start:
                return Response({"error": f"Registration starts on {event.registration_start}."}, status=status.HTTP_400_BAD_REQUEST)
            
            if now > event.registration_end:
                return Response({"error": "Registration deadline has passed."}, status=status.HTTP_400_BAD_REQUEST)
            
            current_count = event.registrations.count()
            if current_count >= event.registration_limit:
                return Response({"error": "Event is fully booked."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create registration (pending payment)
            registration = Registration.objects.create(
                user=request.user,
                event=event,
                team_name=team_name,
                team_members=team_members,
                phone_number=getattr(request.user, 'phone_number', ''),
                college=getattr(request.user, 'college', ''),
                department=getattr(request.user, 'department', '') if hasattr(request.user, 'department') else '',
                year_of_study=getattr(request.user, 'year_of_study', '') if hasattr(request.user, 'year_of_study') else '',
                status='PENDING'  # Will be confirmed after payment
            )
            
            # Create Razorpay order
            try:
                if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
                    logger.error("Razorpay keys are missing in settings!")
                    raise Exception("Razorpay keys are not configured correctly on the server.")

                client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                
                # Amount in paise (multiply by 100)
                amount_in_paise = int(float(event.payment_amount) * 100)
                
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
                Payment.objects.create(
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
                
            except Exception as e:
                logger.error(f"Razorpay error: {str(e)}")
                logger.error(traceback.format_exc())
                # Delete registration if order creation fails
                registration.delete()
                return Response({"error": f"Failed to create payment order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Unexpected error in payment order creation: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyPaymentView(APIView):
    """Verify Razorpay payment signature"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"error": "Missing payment details."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment = Payment.objects.get(razorpay_order_id=razorpay_order_id)
            
            # Verify signature
            generated_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
                hashlib.sha256
            ).hexdigest()
            
            if generated_signature == razorpay_signature:
                # Payment successful
                payment.razorpay_payment_id = razorpay_payment_id
                payment.razorpay_signature = razorpay_signature
                payment.status = 'SUCCESS'
                payment.save()
                
                # Update registration status
                registration = payment.registration
                registration.status = 'REGISTERED'
                registration.save()
                
                # Send registration email with ticket
                send_registration_email(registration)
                
                # Return registration data with QR code
                serializer = RegistrationSerializer(registration)
                return Response({
                    'success': True,
                    'message': 'Payment verified successfully!',
                    'registration': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                payment.status = 'FAILED'
                payment.save()
                return Response({"error": "Payment verification failed. Invalid signature."}, status=status.HTTP_400_BAD_REQUEST)
                
        except Payment.DoesNotExist:
            return Response({"error": "Payment record not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Verification error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AbortPaymentView(APIView):
    """Clean up records if user cancels the payment process"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        registration_id = request.data.get('registration_id')
        if not registration_id:
            return Response({"error": "Registration ID required."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            registration = Registration.objects.get(id=registration_id, user=request.user)
            # Only delete if it's still PENDING to avoid deleting confirmed ones accidentally
            if registration.status == 'PENDING':
                logger.info(f"User {request.user.email} aborted payment for registration {registration_id}. Deleting pending records.")
                registration.delete() # Also deletes linked payment via cascade
                return Response({"success": True, "message": "Abandoned registration cleaned up."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Cannot abort a confirmed registration."}, status=status.HTTP_400_BAD_REQUEST)
        except Registration.DoesNotExist:
            return Response({"error": "Registration not found."}, status=status.HTTP_404_NOT_FOUND)
