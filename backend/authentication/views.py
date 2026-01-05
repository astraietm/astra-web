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

logger = logging.getLogger(__name__)

class GoogleLoginView(APIView):
    authentication_classes = [] # Allow public access
    permission_classes = []

    def post(self, request):
        print(f"DEBUG: Login request received from {request.META.get('REMOTE_ADDR')}")
        token = request.data.get('token')
        
        if not token:
            print("DEBUG: No token provided in request data")
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            import os
            client_id = os.environ.get('GOOGLE_CLIENT_ID')
            print(f"DEBUG: Verifying token with Client ID: {client_id}")
            
            # Verify the token
            try:
                idinfo = id_token.verify_oauth2_token(
                    token, 
                    google_requests.Request(), 
                    client_id
                )
                print(f"DEBUG: Token verified for email: {idinfo.get('email')}")
            except ValueError as e:
                # Print directly to stdout to ensure it shows in Railway logs
                print(f"GOOGLE VERIFICATION FAILED: {str(e)}")
                print(f"EXPECTED CLIENT_ID: {client_id}")
                return Response({'error': f"Token verification failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

            # Use sub (unique google ID) or email
            google_id = idinfo['sub']
            email = idinfo['email']
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')

            # Get or Create User
            try:
                user = User.objects.get(email=email)
                # Update info if changed or missing
                if not user.google_id:
                    user.google_id = google_id
                if picture and user.avatar != picture:
                    user.avatar = picture
                user.save()
            except User.DoesNotExist:
                user = User.objects.create_user(
                    email=email,
                    full_name=name,
                    google_id=google_id,
                    avatar=picture
                )

            # Generate JWT
            refresh = RefreshToken.for_user(user)
            # Add custom claims
            refresh['email'] = user.email
            refresh['full_name'] = user.full_name
            refresh['avatar'] = user.avatar
            refresh['is_staff'] = user.is_staff # CRITICAL FOR ADMIN SCANNER

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'name': user.full_name,
                    'avatar': user.avatar,
                    'is_staff': user.is_staff # Return to frontend
                }
            })

        except ValueError as e:
            logger.error(f"Google Token Error: {e}")
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Login Error: {e}")
            return Response({'error': 'Authentication failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
