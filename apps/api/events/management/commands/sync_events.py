import os
import requests
import logging
from django.core.management.base import BaseCommand
from django.utils import timezone
from events.models import Event

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Sync events from a remote JSON source or environment to backend database'

    def handle(self, *args, **options):
        # Determine if we should overwrite existing data
        force_sync = os.environ.get('FORCE_SYNC', 'false').lower() == 'true'
        sync_url = os.environ.get('SYNC_DATA_URL')

        if not sync_url:
            self.stdout.write(self.style.WARNING("SYNC_DATA_URL not set. Skipping automated sync. Manage events via Django Admin."))
            return

        try:
            self.stdout.write(f"Fetching sync data from: {sync_url}")
            response = requests.get(sync_url)
            response.raise_for_status()
            events_to_sync = response.json()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to fetch sync data: {str(e)}"))
            return

        for event_data in events_to_sync:
            defaults = {
                "title": event_data.get('title'),
                "description": event_data.get('description', ''),
                "venue": event_data.get('venue', ''),
                "category": event_data.get('category', ''),
                "requires_payment": event_data.get('requires_payment', False),
                "payment_amount": event_data.get('payment_amount', 0.00),
                "registration_limit": event_data.get('registration_limit', 100),
                "is_team_event": event_data.get('is_team_event', False),
                "event_date": event_data.get('event_date'),
                "is_registration_open": event_data.get('is_registration_open', True),
                "registration_start": event_data.get('registration_start', timezone.now()),
                "registration_end": event_data.get('registration_end', event_data.get('event_date')),
                "prize": event_data.get('prize', ''),
                "content_blocks": event_data.get('content_blocks', []),
                "coordinators": event_data.get('coordinators', []),
                "time": event_data.get('time', ''),
                "duration": event_data.get('duration', ''),
                "image": event_data.get('image', '')
            }

            if force_sync:
                event, created = Event.objects.update_or_create(id=event_data['id'], defaults=defaults)
                action = "Updated" if not created else "Created"
            else:
                event, created = Event.objects.get_or_create(id=event_data['id'], defaults=defaults)
                action = "Created" if created else "Skipped (already exists)"

            self.stdout.write(self.style.SUCCESS(f"{action} event: {event.title} (ID: {event.id})"))

        self.stdout.write(self.style.SUCCESS("Sync process completed."))
