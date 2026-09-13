from django.conf import settings
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import User
from .serializers import UserSerializer
import logging
import os

logger = logging.getLogger(__name__)

class GoogleLoginView(APIView):
    authentication_classes = [] # Allow public access
    permission_classes = []

    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client_id = os.environ.get('GOOGLE_CLIENT_ID')
            if not client_id:
                logger.error("GOOGLE_CLIENT_ID is missing in server environment.")
                return Response({'error': 'Server configuration error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Verify the token
            try:
                idinfo = id_token.verify_oauth2_token(
                    token, 
                    google_requests.Request(), 
                    client_id
                )
            except ValueError as e:
                logger.error(f"Google Token Verification Failed: {e}")
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

            # Use sub (unique google ID) or email
            google_id = idinfo['sub']
            email = idinfo['email'].lower().strip()
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')

            # Get or Create User
            try:
                user = User.objects.get(email__iexact=email)
                # Update info if changed or missing
                if not user.google_id:
                    user.google_id = google_id
                if picture and user.avatar != picture:
                    user.avatar = picture
                
                # Check if user should be staff (if added to allowed list or is superuser / in Admin group)
                from .models import AllowedEmail
                try:
                    AllowedEmail.objects.get(email__iexact=email)
                    user.is_staff = True
                except AllowedEmail.DoesNotExist:
                    pass  # Keep existing is_staff status

                if user.is_superuser or user.groups.filter(name__iexact='Admin').exists():
                    user.is_staff = True

                user.save()
            except User.DoesNotExist:
                # Check whitelist for new users
                from .models import AllowedEmail
                is_staff = False
                
                try:
                    AllowedEmail.objects.get(email__iexact=email)
                    is_staff = True
                except AllowedEmail.DoesNotExist:
                    pass

                user = User.objects.create_user(
                    email=email,
                    full_name=name,
                    google_id=google_id,
                    avatar=picture,
                    is_staff=is_staff
                )

            is_admin_access = bool(user.is_staff or user.is_superuser or user.groups.filter(name__iexact='Admin').exists())

            # Generate JWT
            refresh = RefreshToken.for_user(user)
            # Add custom claims
            refresh['email'] = user.email
            refresh['full_name'] = user.full_name
            refresh['avatar'] = user.avatar
            refresh['is_staff'] = is_admin_access
            refresh['is_superuser'] = user.is_superuser
            refresh['phone_number'] = user.phone_number
            refresh['college'] = user.college
            refresh['usn'] = user.usn

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'name': user.full_name,
                    'avatar': user.avatar,
                    'is_staff': is_admin_access,
                    'is_superuser': user.is_superuser,
                    'phone_number': user.phone_number,
                    'college': user.college,
                    'usn': user.usn
                }
            })

        except ValueError as e:
            logger.error(f"Google Token Error: {e}", exc_info=True)
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Login Error: {e}", exc_info=True)
            return Response({'error': 'Authentication failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

