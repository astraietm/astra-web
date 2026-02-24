from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    EventListView, 
    EventDetailView,
    RegistrationCreateView, 
    MyRegistrationsView, 
    VerifyTokenView,
    AdminRegistrationsView,
    AdminEventViewSet,
    CreatePaymentOrderView,
    VerifyPaymentView,
    ClearRegistrationsView,
    SyncEventsView
)

router = DefaultRouter()
router.register(r'operations/events', AdminEventViewSet, basename='admin-events')

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('register/', RegistrationCreateView.as_view(), name='register'),
    path('my-registrations/', MyRegistrationsView.as_view(), name='my-registrations'),
    path('verify/<str:token>/', VerifyTokenView.as_view(), name='verify'),
    path('admin-registrations/', AdminRegistrationsView.as_view(), name='admin-registrations'),
    path('payment/create-order/', CreatePaymentOrderView.as_view(), name='create-payment-order'),
    path('payment/verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('admin-registrations/clear/', ClearRegistrationsView.as_view(), name='clear-registrations'),
    path('operations/sync-events/', SyncEventsView.as_view(), name='sync-events'),
] + router.urls
