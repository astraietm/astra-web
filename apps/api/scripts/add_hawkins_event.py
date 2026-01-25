import os
import sys
import django
from django.utils import timezone

# Adjust path to include the project root (apps/api)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.append(project_root)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from events.models import Event

def add_event():
    new_title = "HAWKINS LAB"
    old_title = "HAWKINS LAB – Cyber Mystery Event"
    
    # Check for old title and update if it exists
    existing_old = Event.objects.filter(title=old_title).first()
    if existing_old:
        existing_old.title = new_title
        existing_old.save()
        print(f"Updated existing event title from '{old_title}' to '{new_title}'")
        return

    # Check if new title already exists
    if Event.objects.filter(title=new_title).exists():
        print(f"Event '{new_title}' already exists. Skipping creation.")
        return

    # Create the event
    event = Event.objects.create(
        title=new_title,
        description="Hawkins Lab is a Stranger Things–themed, story-driven cybersecurity mystery event where teams progress through multiple levels by solving clues, analyzing patterns, and completing computer-based challenges.",
        # Set a default date 14 days from now, can be changed in Admin
        event_date=timezone.now() + timezone.timedelta(days=14),
        venue="Computer Lab 1",
        category="Cyber Mystery",
        # Dark/Red aesthetic image
        image="https://images.unsplash.com/photo-1519060888021-35966d58597c?auto=format&fit=crop&q=80&w=2070",
        is_registration_open=True,
        registration_limit=20, # Teams
        registration_start=timezone.now(),
        registration_end=timezone.now() + timezone.timedelta(days=13)
    )
    
    print(f"Successfully created event: {event.title} (ID: {event.id})")

if __name__ == '__main__':
    add_event()
