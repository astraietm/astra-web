from rest_framework import serializers
from .models import Registration, Event
from .utils import generate_qr_code

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    qr_code = serializers.SerializerMethodField()
    event_details = EventSerializer(source='event', read_only=True)
    
    class Meta:
        model = Registration
        fields = ['id', 'user', 'event', 'event_details', 'timestamp', 'updated_at', 'token', 'qr_code', 'status', 'is_used']
        read_only_fields = ['id', 'user', 'timestamp', 'updated_at', 'token', 'qr_code', 'is_used', 'status']

    def get_qr_code(self, obj):
        if obj.token:
            return generate_qr_code(obj.token)
        return None
