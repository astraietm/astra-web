from django.urls import path
from .views import (
    AuditLogListView, 
    SystemSettingListCreateView, 
    NotificationListCreateView, 
    PublicConfigView,
    AllowedEmailListCreateView,
    AllowedEmailDeleteView
)

urlpatterns = [
    path('logs/', AuditLogListView.as_view(), name='audit-logs'),
    path('settings/', SystemSettingListCreateView.as_view(), name='system-settings'),
    path('notifications/', NotificationListCreateView.as_view(), name='notifications'),
    path('public-config/', PublicConfigView.as_view(), name='public-config'),
    path('team/', AllowedEmailListCreateView.as_view(), name='team-list'),
    path('team/<int:pk>/', AllowedEmailDeleteView.as_view(), name='team-delete'),
]
