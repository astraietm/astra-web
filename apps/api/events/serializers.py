from rest_framework import serializers
from .models import Registration, Event, Payment
from .utils import generate_qr_code

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    registration_count = serializers.SerializerMethodField()

    def get_registration_count(self, obj):
        return obj.registrations.count()

    def validate(self, data):
        return data

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'amount', 'currency', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class RegistrationSerializer(serializers.ModelSerializer):
    qr_code = serializers.SerializerMethodField()
    event_details = EventSerializer(source='event', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    user_phone = serializers.SerializerMethodField()
    user_college = serializers.SerializerMethodField()
    payment_details = PaymentSerializer(source='payment', read_only=True)
    
    class Meta:
        model = Registration
        fields = ['id', 'user', 'user_email', 'user_name', 'user_phone', 'phone_number', 'college', 'department', 'year_of_study', 'user_college', 'event', 'event_details', 'timestamp', 'updated_at', 'token', 'qr_code', 'status', 'is_used', 'team_name', 'team_members', 'payment_details']
        read_only_fields = ['id', 'user', 'timestamp', 'updated_at', 'token', 'qr_code', 'is_used', 'status', 'user_phone']

    def get_user_name(self, obj):
        return (obj.user.full_name if obj.user and obj.user.full_name else '') or obj.user.email

    def get_user_phone(self, obj):
        return obj.phone_number or (obj.user.phone_number if obj.user and hasattr(obj.user, 'phone_number') else '')

    def get_user_college(self, obj):
        return obj.college or (obj.user.college if obj.user and hasattr(obj.user, 'college') else '')

    def get_qr_code(self, obj):
        if obj.token:
            return generate_qr_code(obj.token, color="#000000")
        return None
