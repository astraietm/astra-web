from django.contrib import admin
from django.http import HttpResponse
import csv
from .models import Registration, Event, Payment

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'time', 'venue', 'category', 'is_registration_open', 'requires_payment', 'payment_amount')
    search_fields = ('title', 'venue')
    list_filter = ('is_registration_open', 'category', 'requires_payment')
    
    # Ensure time field is editable in admin
    fields = ('title', 'description', 'event_date', 'time', 'duration', 'venue', 'image', 'category', 
              'registration_start', 'registration_end', 'registration_limit', 'is_registration_open',
              'is_team_event', 'team_size_min', 'team_size_max',
              'requires_payment', 'payment_amount', 'prize', 'content_blocks', 'coordinators')

class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('get_user_email', 'get_user_name', 'get_event_title', 'phone_number', 'college', 'department', 'year_of_study', 'team_members', 'status', 'timestamp')
    list_filter = ('status', 'event', 'college', 'year_of_study', 'timestamp')
    search_fields = ('user__email', 'user__full_name', 'phone_number', 'token', 'event__title', 'team_members')
    actions = ['export_as_csv', 'resend_confirmation_email']

    def resend_confirmation_email(self, request, queryset):
        from .emails import send_registration_email
        count = 0
        for registration in queryset:
            if send_registration_email(registration):
                count += 1
        self.message_user(request, f"Sent {count} emails successfully.")
    resend_confirmation_email.short_description = "Resend QR Email"

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'

    def get_user_name(self, obj):
        return obj.user.full_name
    get_user_name.short_description = 'Name'

    def get_event_title(self, obj):
        return obj.event.title
    get_event_title.short_description = 'Event'

    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        # Custom CSV export to handle ForeignKeys nicely
        field_names = ['User Email', 'User Name', 'Event', 'Phone', 'College', 'Department', 'Year', 'Team Members', 'Status', 'Timestamp']
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format('registrations')
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            writer.writerow([
                obj.user.email,
                obj.user.full_name,
                obj.event.title,
                obj.phone_number,
                obj.college,
                obj.department,
                obj.year_of_study,
                obj.team_members,
                obj.status,
                obj.timestamp
            ])

        return response

    export_as_csv.short_description = "Export Selected to CSV"

    def get_queryset(self, request):
        return super().get_queryset(request)

class PaymentAdmin(admin.ModelAdmin):
    list_display = ('razorpay_order_id', 'get_user_email', 'get_event_title', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('razorpay_order_id', 'razorpay_payment_id', 'registration__user__email')
    readonly_fields = ('razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'created_at', 'updated_at')
    
    def get_user_email(self, obj):
        return obj.registration.user.email
    get_user_email.short_description = 'User Email'
    
    def get_event_title(self, obj):
        return obj.registration.event.title
    get_event_title.short_description = 'Event'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # If user is specifically filtering by status, show all. 
        # Otherwise, show only SUCCESS by default to keep things clean.
        if 'status__exact' in request.GET:
            return qs
        return qs.filter(status='SUCCESS')

admin.site.register(Event, EventAdmin)
admin.site.register(Registration, RegistrationAdmin)
admin.site.register(Payment, PaymentAdmin)
