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
    premium_image = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2070"
    
    # 1. Force Clean up of any previous Hawkins records to fix image/title bugs
    Event.objects.filter(title__icontains="Hawkins").delete()

    # 2. Modern Content Definition
    content_blocks = [
        {
            "title": "Mission Objectives",
            "items": [
                {"title": "Level 1 – Reflex Test", "content": "Neuromotor synchronization check. Beat the system clock to gain initial access."},
                {"title": "Level 2 – Data Entry", "content": "High-speed information processing. Decrypt real-time streams to find the breach."},
                {"title": "Level 3 – Pattern Analysis", "content": "Cognitive logic puzzle solving. Analyze the Upside Down signal patterns."},
                {"title": "Level 4 – Signal Tracing", "content": "Digital footprint investigation. Trace the source of the anomaly across the Hawkins network."},
                {"title": "Level 5 – System Override", "content": "Mainframe brute force access. Complete the final handshake to seal the gate."}
            ]
        },
        {
            "title": "Participation Rules",
            "list": [
                "Teams must consist of 2 to 4 members.",
                "Sequential clearance is required; each level unlocks the next tier.",
                "No external solving tools or internet search for specific flags.",
                "The first team to complete Level 5 successfully wins."
            ]
        },
        {
            "title": "Guidelines",
            "content": "Hawkins Lab is an immersive, story-driven cyber-mystery. While technical skills help, pattern recognition and logic are your primary tools. Stay focused, stay synchronized."
        }
    ]

    coordinators = [
        {"name": "Dustin Henderson", "phone": "999-011-2026", "role": "Field Tech"},
        {"name": "Mike Wheeler", "phone": "999-012-2026", "role": "Operations"}
    ]

    # 3. Create/Update the event
    event = Event.objects.create(
        id=997,
        title=new_title,
        description="An immersive cyber-mystery event. Teams compete to solve cryptic clues, analyze signals, and breach the Upside Down. Beginner friendly.",
        event_date=timezone.now() + timezone.timedelta(days=14),
        venue="Computer Lab 1",
        category="Cyber Mystery",
        image=premium_image,
        is_registration_open=True,
        registration_limit=20, 
        registration_start=timezone.now(),
        registration_end=timezone.now() + timezone.timedelta(days=13),
        is_team_event=True,
        team_size_min=2,
        team_size_max=4,
        requires_payment=True,
        payment_amount=100.00,
        prize="₹1000 + Merit Certificates",
        time="10:00 AM",
        duration="2 Hours",
        content_blocks=content_blocks,
        coordinators=coordinators
    )
    
    print(f"Successfully synced Premium Event: {event.title} (ID: {event.id})")

if __name__ == '__main__':
    add_event()
