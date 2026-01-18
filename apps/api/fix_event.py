import os
import django
import sys

# Setup Django Environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from events.models import Event

def fix():
    try:
        # Find Hawkins
        events = Event.objects.filter(title__icontains='Hawkins')
        if not events.exists():
            print("No Hawkins event found!")
            # List all
            print("Events found:", [e.title for e in Event.objects.all()])
            return

        for e in events:
            print(f"Updating {e.title}...")
            e.is_team_event = True
            e.team_size_min = 2
            e.team_size_max = 4
            e.save()
            print(f"SUCCESS: {e.title} is now a Team Event (Min: {e.team_size_min}, Max: {e.team_size_max})")

    except Exception as ex:
        print(f"Error: {ex}")

if __name__ == "__main__":
    fix()
