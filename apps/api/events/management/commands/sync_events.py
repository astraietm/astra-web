from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from events.models import Event

class Command(BaseCommand):
    help = 'Sync events from frontend data to backend database'

    def handle(self, *args, **options):
        events_to_sync = [
            {
                "id": 995,
                "title": "Shadow Login",
                "description": "Crack. Decode. Access. Shadow Login is a time-bound individual cybersecurity challenge designed to test your skills in cryptography, logical analysis, and real-world password attack techniques.",
                "venue": "CCF/BCA Lab",
                "category": "CTF Challenge",
                "requires_payment": True,
                "payment_amount": 50.00,
                "registration_limit": 30,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 12, 11, 0))
            },
            {
                "id": 996,
                "title": "Cipher Decode",
                "description": "Decode the Chat. Find the Secret. A hands-on cryptography challenge where participants must manually decrypt an encrypted WhatsApp-style conversation using a physical cipher key.",
                "venue": "Systems Lab",
                "category": "Cryptanalysis Challenge",
                "requires_payment": True,
                "payment_amount": 50.00,
                "registration_limit": 20,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 12, 14, 0))
            }
        ]

        for event_data in events_to_sync:
            event, created = Event.objects.update_or_create(
                id=event_data['id'],
                defaults={
                    "title": event_data['title'],
                    "description": event_data['description'],
                    "venue": event_data['venue'],
                    "category": event_data['category'],
                    "requires_payment": event_data['requires_payment'],
                    "payment_amount": event_data['payment_amount'],
                    "registration_limit": event_data['registration_limit'],
                    "is_team_event": event_data['is_team_event'],
                    "event_date": event_data['event_date'],
                    "is_registration_open": True,
                    "registration_start": timezone.now(),
                    "registration_end": event_data['event_date']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created event: {event.title} (ID: {event.id})"))
            else:
                self.stdout.write(self.style.SUCCESS(f"Updated event: {event.title} (ID: {event.id})"))
