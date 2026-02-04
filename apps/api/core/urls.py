from django.contrib import admin
from django.urls import path, include
from .views import health

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health, name='health_check'), # Health Check
    path('heartbeat/', health, name='heartbeat'), # Heartbeat alias for frontend
    path('auth/', include('authentication.urls')), # Authentication Endpoints
    path('gallery/', include('gallery.urls')), # Gallery Endpoints
    path('ops/', include('ops.urls')), # Operations Endpoints
    path('', include('events.urls')), # Events and Registration Endpoints
]
