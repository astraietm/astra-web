from django.urls import path
from .views import GoogleLoginView, UserProfileView, AdminUsersView

urlpatterns = [
    path('google/', GoogleLoginView.as_view(), name='google_login'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('admin-users/', AdminUsersView.as_view(), name='admin_users'),
]
