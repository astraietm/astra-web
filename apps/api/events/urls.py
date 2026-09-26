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
    CancelPaymentView,
    ClearRegistrationsView,
    SyncEventsView,
    CertificateAttendeesView,
)

router = DefaultRouter()
router.register(r'operations/events', AdminEventViewSet, basename='admin-events')

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('register/', RegistrationCreateView.as_view(), name='register'),
    path('my-registrations/', MyRegistrationsView.as_view(), name='my-registrations'),
    path('verify/<str:token>/', VerifyTokenView.as_view(), name='verify'),
    path('operations/verify/<str:token>/', VerifyTokenView.as_view(), name='operations-verify'),
    path('admin-registrations/', AdminRegistrationsView.as_view(), name='admin-registrations'),
    path('events/admin/registrations/', AdminRegistrationsView.as_view(), name='events-admin-registrations'),
    
    # Razorpay Standard Payment Endpoints
    path('payment/create-order/', CreatePaymentOrderView.as_view(), name='create-payment-order'),
    path('create-order/', CreatePaymentOrderView.as_view(), name='generic-create-order'),
    path('payment/verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('payment/verify-order/', VerifyPaymentView.as_view(), name='verify-payment-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='generic-verify-payment'),
    path('payment/cancel/', CancelPaymentView.as_view(), name='cancel-payment'),
    path('payment/failed/', CancelPaymentView.as_view(), name='failed-payment'),
    
    path('admin-registrations/clear/', ClearRegistrationsView.as_view(), name='clear-registrations'),
    path('operations/sync-events/', SyncEventsView.as_view(), name='sync-events'),
    path('certificates/attendees/', CertificateAttendeesView.as_view(), name='certificate-attendees'),
] + router.urls
