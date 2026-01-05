from django.urls import path
from .views import (
    EventListView, 
    RegistrationCreateView, 
    MyRegistrationsView, 
    VerifyTokenView,
    AdminRegistrationsView
)

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),
    path('register/', RegistrationCreateView.as_view(), name='register'),
    path('my-registrations/', MyRegistrationsView.as_view(), name='my-registrations'),
    path('verify/<str:token>/', VerifyTokenView.as_view(), name='verify'),
    path('admin-registrations/', AdminRegistrationsView.as_view(), name='admin-registrations'),
]
