from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'avatar', 'google_id', 'is_staff']
        read_only_fields = ['id', 'email', 'google_id', 'is_staff']
