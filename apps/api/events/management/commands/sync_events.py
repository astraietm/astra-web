from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
from events.models import Event

DEFAULT_EVENTS = [
    {
        "title": "Sovereign Digital Frontiers: Threat Horizons & Zero-Day Defenses",
        "description": "Inaugural keynote with national cyber defense chiefs dissecting AI-augmented offensive vectors and sovereign cybersecurity resilience.",
        "category": "KEYNOTE",
        "venue": "Main Auditorium, KMCT Campus, Calicut",
        "time": "09:30 AM - 11:00 AM IST",
        "duration": "1.5 Hours",
        "event_date": "2026-10-06T09:30:00Z",
        "registration_limit": 300,
        "is_registration_open": True,
        "is_team_event": False,
        "requires_payment": False,
        "payment_amount": 0.00,
        "prize": "Certificates & Delegate Kits",
    },
    {
        "title": "Advanced Binary Exploitation & Memory Corruption with Ghidra & GDB",
        "description": "Hands-on deep dive into reverse engineering, ROP chain construction, and buffer overflow mitigations.",
        "category": "WORKSHOP",
        "venue": "Advanced Computing Lab 1, Dept of Cyber Security",
        "time": "11:30 AM - 02:00 PM IST",
        "duration": "2.5 Hours",
        "event_date": "2026-10-06T11:30:00Z",
        "registration_limit": 60,
        "is_registration_open": True,
        "is_team_event": False,
        "requires_payment": True,
        "payment_amount": 250.00,
        "prize": "Workshop Certificate & Pro Toolkit",
    },
    {
        "title": "ASTRA 24-Hour National CTF: Jeopardy & Live Attack/Defense Arena",
        "description": "National flagship 24-hour cybersecurity competition featuring Web, Crypto, Reverse, Forensics, and Pwn challenges.",
        "category": "FLAGSHIP CTF",
        "venue": "Cyber Arena & Global Remote Portal",
        "time": "03:00 PM (24 Hours)",
        "duration": "24 Hours",
        "event_date": "2026-10-06T15:00:00Z",
        "registration_limit": 100,
        "is_registration_open": True,
        "is_team_event": True,
        "team_size_min": 1,
        "team_size_max": 4,
        "requires_payment": True,
        "payment_amount": 500.00,
        "prize": "₹50,000 Cash Pool & Trophies",
    },
    {
        "title": "National Cyber Security Project Exhibition & Paper Presentation",
        "description": "Showcase innovative research papers, hardware security prototypes, and software tools to industry experts.",
        "category": "RESEARCH EXPO",
        "venue": "Innovation Gallery, KMCT Institute",
        "time": "10:00 AM - 01:30 PM IST",
        "duration": "3.5 Hours",
        "event_date": "2026-10-07T10:00:00Z",
        "registration_limit": 50,
        "is_registration_open": True,
        "is_team_event": True,
        "team_size_min": 1,
        "team_size_max": 3,
        "requires_payment": False,
        "payment_amount": 0.00,
        "prize": "Best Paper & Innovation Awards",
    },
    {
        "title": "Valedictory, Bounty Prize Distribution & Cyber Networking",
        "description": "Closing ceremony, prize distribution for CTF winners, research awards, and networking session with industry leaders.",
        "category": "GRAND FINALE",
        "venue": "Main Auditorium, KMCT Campus, Calicut",
        "time": "04:00 PM - 06:30 PM IST",
        "duration": "2.5 Hours",
        "event_date": "2026-10-07T16:00:00Z",
        "registration_limit": 400,
        "is_registration_open": True,
        "is_team_event": False,
        "requires_payment": False,
        "payment_amount": 0.00,
        "prize": "Trophies, Swag & Networking",
    },
]

class Command(BaseCommand):
    help = 'Sync and seed default events into the backend database'

    def handle(self, *args, **options):
        synced_count = 0
        for data in DEFAULT_EVENTS:
            title = data['title']
            date_val = parse_datetime(data['event_date'])
            
            event, created = Event.objects.get_or_create(
                title=title,
                defaults={
                    'description': data.get('description', ''),
                    'category': data.get('category', 'OTHER'),
                    'venue': data.get('venue', 'KMCT Campus'),
                    'time': data.get('time', ''),
                    'duration': data.get('duration', ''),
                    'event_date': date_val,
                    'registration_limit': data.get('registration_limit', 100),
                    'is_registration_open': data.get('is_registration_open', True),
                    'is_team_event': data.get('is_team_event', False),
                    'team_size_min': data.get('team_size_min', 1),
                    'team_size_max': data.get('team_size_max', 1),
                    'requires_payment': data.get('requires_payment', False),
                    'payment_amount': data.get('payment_amount', 0.00),
                    'prize': data.get('prize', ''),
                }
            )
            if created:
                synced_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created event: {title}"))
            else:
                self.stdout.write(f"Event already exists: {title}")

        self.stdout.write(self.style.SUCCESS(f"Sync complete. Added {synced_count} new default events."))
