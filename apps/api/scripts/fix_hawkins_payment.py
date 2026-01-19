import os
import django
import sys

# Add the project root to the python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from events.models import Event

def fix_hawkins_event():
    try:
        # Find events matching Hawkins
        events = Event.objects.filter(title__icontains='Hawkins')
        
        if not events.exists():
            print("No Hawkins event found to update.")
            return

        for event in events:
            print(f"Updating event: {event.title} (ID: {event.id})")
            print(f"Old status - Requires Payment: {event.requires_payment}, Amount: {event.payment_amount}")
            
            event.requires_payment = True
            event.payment_amount = 100.00
            event.save()
            
            print(f"New status - Requires Payment: {event.requires_payment}, Amount: {event.payment_amount}")
            print("-" * 30)
            
        print("Successfully updated Hawkins event(s).")
        
    except Exception as e:
        print(f"Error updating event: {e}")

if __name__ == "__main__":
    fix_hawkins_event()
