from django.contrib import admin
from django.http import HttpResponse
import csv
from .models import Registration, Event

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'venue', 'category', 'is_registration_open')
    search_fields = ('title', 'venue')
    list_filter = ('is_registration_open', 'category')

class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('get_user_email', 'get_user_name', 'get_event_title', 'is_used', 'timestamp')
    list_filter = ('event__title', 'is_used', 'timestamp')
    search_fields = ('user__email', 'user__full_name', 'token', 'event__title')
    actions = ['export_as_csv']

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
        field_names = ['User Email', 'User Name', 'Event', 'Token', 'Is Used', 'Timestamp']
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format('registrations')
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            writer.writerow([
                obj.user.email,
                obj.user.full_name,
                obj.event.title,
                obj.token,
                obj.is_used,
                obj.timestamp
            ])

        return response

    export_as_csv.short_description = "Export Selected to CSV"

admin.site.register(Event, EventAdmin)
admin.site.register(Registration, RegistrationAdmin)
