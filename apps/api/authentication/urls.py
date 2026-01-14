from django.urls import path
from .views import GoogleLoginView, UserProfileView

urlpatterns = [
    path('google/', GoogleLoginView.as_view(), name='google_login'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
]
