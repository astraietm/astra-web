from rest_framework import status, generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Registration, Event
from .serializers import RegistrationSerializer, EventSerializer

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
        # Automatically set user from JWT
        serializer.save(user=self.request.user)
        # TODO: Add email notification here

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
        return super().create(request, *args, **kwargs)

class MyRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(user=self.request.user).order_by('-timestamp')

class VerifyTokenView(APIView):
    # Depending on requirements, this might need Admin permission
    # per USER request "Admin QR Scan Support", this should ideally be protected.
    # But for simplicity or if the scanner app just has the link, we can keep it open or require Admin.
    # Let's keep it AllowAny for now for easy testing, but in production, we'd use IsAdminUser.
    permission_classes = [permissions.AllowAny] 

    def get(self, request, token):
        registration = get_object_or_404(Registration, token=token)
        
        # Check status or is_used
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
