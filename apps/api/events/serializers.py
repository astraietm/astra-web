from rest_framework import serializers
from .models import Registration, Event
from .utils import generate_qr_code

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    def validate(self, data):
        """
        Check that registration_end is after registration_start.
        """
        if 'registration_start' in data and 'registration_end' in data:
            if data['registration_end'] <= data['registration_start']:
                raise serializers.ValidationError({
                    "registration_end": "Registration end date must be after start date."
                })
        return data

class RegistrationSerializer(serializers.ModelSerializer):
    qr_code = serializers.SerializerMethodField()
    event_details = EventSerializer(source='event', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_college = serializers.CharField(source='user.college', read_only=True)
    
    class Meta:
        model = Registration
        fields = ['id', 'user', 'user_email', 'user_name', 'user_phone', 'user_college', 'event', 'event_details', 'timestamp', 'updated_at', 'token', 'qr_code', 'status', 'is_used', 'team_name', 'team_members']
        read_only_fields = ['id', 'user', 'timestamp', 'updated_at', 'token', 'qr_code', 'is_used', 'status']

    def get_qr_code(self, obj):
        if obj.token:
            return generate_qr_code(obj.token)
        return None
