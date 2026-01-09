from rest_framework import serializers
from .models import AuditLog, SystemSetting, Notification
from authentication.serializers import UserSerializer

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'user_email', 'action', 'details', 'ip_address', 'level', 'timestamp']
    
    def get_user_email(self, obj):
        return obj.user.email if obj.user else 'System'

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ['key', 'value', 'description', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'subject', 'message', 'priority', 'recipients_criteria', 'sent_by', 'created_at']
        read_only_fields = ['sent_by', 'created_at']
