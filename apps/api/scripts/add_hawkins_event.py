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
            "title": "Mission Briefing",
            "content": "ENTER THE UPSIDE DOWN AND STOP VECNA! This event is task-based and story-driven, inspired by cybersecurity concepts such as data accuracy, signal analysis, social engineering, and authentication, presented in a safe, fun, and interactive simulation.",
        },
        {
            "title": "Levels Breakdown",
            "items": [
                {"title": "Level 1 – Gaming", "content": "Initial contact. Test your focus and reflexes in the digital void."},
                {"title": "Level 2 – Speed Typing", "content": "Critical data entry. Extract credentials under high-pressure constraints."},
                {"title": "Level 3 – Analysis & Decoding", "content": "Cognitive override. Analyze signals and solve cryptic patterns to unlock the breach."},
                {"title": "Level 4 – Digital Stalking", "content": "Network tracing. Track an anomaly's footprint across the Hawkins infrastructure."},
                {"title": "Level 5 – Brute Force", "content": "The final approach. Execute a system override to seal the gate and stop Vecna."}
            ]
        },
        {
            "title": "Operational Rules",
            "list": [
                "Team Size: 2-4 members per squad.",
                "Sequential Protocol: 5 Levels - 5 PCs. Levels must be completed in order.",
                "PC Order: Teams must strictly follow the assigned hardware sequence.",
                "Integrity: Skipping levels or sharing clues is strictly prohibited.",
                "System Use: Only provided systems/terminals may be used for the mission.",
                "No team changes are permitted once the countdown begins."
            ]
        },
        {
            "title": "Mission Outcome",
            "content": "Fastest team to successfully navigate all 5 levels and execute the final override wins. No advanced technical knowledge is required—all students are authorized to participate."
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
        description="A Stranger Things–themed cyber mystery event where teams solve clues, analyze patterns, and complete computer-based tasks to progress through an immersive storyline.",
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
