from django.contrib import admin
from django.urls import path, include
from .views import health

api_patterns = [
    path('health/', health, name='health_check'), # Health Check
    path('heartbeat/', health, name='heartbeat'), # Heartbeat alias for frontend
    path('auth/', include('authentication.urls')), # Authentication Endpoints
    path('gallery/', include('gallery.urls')), # Gallery Endpoints
    path('ops/', include('ops.urls')), # Operations Endpoints
    path('operations/', include('ops.urls')), # Operations Endpoints Alias
    path('', include('events.urls')), # Events and Registration Endpoints
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_patterns)),
] + api_patterns
