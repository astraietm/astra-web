#!/usr/bin/env python
"""
Quick script to check event time values directly from the database
Run this to verify what's actually stored in Supabase
"""

import os
import sys
import django

# Add the project to the path
sys.path.insert(0, '/home/cobra_sanjay/astra-web/apps/api')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Setup Django
django.setup()

from events.models import Event

print("\n" + "="*60)
print("EVENT TIME VALUES FROM DATABASE")
print("="*60 + "\n")

events = Event.objects.all().order_by('-created_at')[:10]

if not events:
    print("No events found in database.")
else:
    print(f"{'ID':<5} {'Title':<30} {'Time':<20} {'Event Date':<20}")
    print("-" * 80)
    for event in events:
        print(f"{event.id:<5} {event.title[:30]:<30} {event.time or 'Not Set':<20} {str(event.event_date)[:19]:<20}")

print("\n" + "="*60)
print("If the time values above match what you set in Supabase,")
print("then the issue is browser caching in Django admin.")
print("="*60 + "\n")
