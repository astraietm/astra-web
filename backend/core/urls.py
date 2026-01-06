from django.contrib import admin
from django.urls import path, include
from .views import health, test_email

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health, name='health_check'), # Health Check
    path('test-email/', test_email, name='test_email'), # Email Debug Endpoint
    path('auth/', include('authentication.urls')), # Authentication Endpoints
    path('', include('events.urls')), # Events and Registration Endpoints
]
