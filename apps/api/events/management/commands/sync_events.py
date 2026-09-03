from django.core.management.base import BaseCommand
from events.models import Event

class Command(BaseCommand):
    help = 'Sync events from frontend data to backend database'

    def handle(self, *args, **options):
        Event.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("All events removed."))
