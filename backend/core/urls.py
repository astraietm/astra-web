from django.contrib import admin
from django.urls import path, include
from .views import health

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health, name='health_check'), # Health Check
    path('auth/', include('authentication.urls')), # Authentication Endpoints
    path('', include('events.urls')), # Events and Registration Endpoints
]
