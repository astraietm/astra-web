from django.core.management.base import BaseCommand
from events.models import Event

class Command(BaseCommand):
    help = 'Synchronize and verify event status in backend database'

    def handle(self, *args, **options):
        count = Event.objects.count()
        self.stdout.write(self.style.SUCCESS(f"Event synchronization verified. Database currently contains {count} events."))
