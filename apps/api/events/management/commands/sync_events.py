from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from events.models import Event

class Command(BaseCommand):
    help = 'Sync events from frontend data to backend database'

    def handle(self, *args, **options):
        # 1. Cleanup legacy duplicates (anything with Hawkins in title that isn't ID 1)
        Event.objects.filter(title__icontains="Hawkins").exclude(id=1).delete()

        events_to_sync = [
            {
                "id": 1,
                "title": "Hawkins Lab",
                "description": "Lost Login: A Stranger Things–themed cyber mystery event where teams solve clues, analyze patterns, and complete tasks to progress through an immersive storyline.",
                "venue": "BCA lab",
                "category": "Cyber Mystery",
                "requires_payment": False,
                "payment_amount": 0.00,
                "registration_limit": 24,
                "is_team_event": True,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 10, 0)),
                "prize": "Merit Certificates",
                "time": "10:00 AM",
                "duration": "2 Hours",
                "content_blocks": [
                    {
                        "title": "Levels Breakdown",
                        "items": [
                            {"title": "Level 1 – Gaming", "content": "Initial contact. Test your focus and reflexes in the digital void."},
                            {"title": "Level 2 – Speed Typing", "content": "Critical data entry. Extract credentials under high-pressure constraints."},
                            {"title": "Level 3 – Analysis & Decoding", "content": "Cognitive override. Analyze signals and solve cryptic patterns to unlock the breach."},
                            {"title": "Level 4 – Digital Stalking", "content": "Network tracing. Track an anomaly's footprint across the Hawkins infrastructure."},
                            {"title": "Level 5 – Brute Force", "content": "The final approach. Execute a system override to seal the gate and stop Vecna."}
                        ]
                    }
                ],
                "coordinators": [
                    {"name": "Anamika", "role": "Lead Coordinator"}
                ],
                "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2070",
                "is_registration_open": True
            },
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
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 11, 0)),
                "time": "11:00 AM",
                "duration": "1 Hour 30 Mins",
                "prize": "₹500",
                "content_blocks": [
                    {
                        "title": "Protocol Structure",
                        "items": [
                           {"title": "Tier 1 – Hash Hunt", "content": "Identify the correct plaintext from provided hashes to unlock system credentials."},
                           {"title": "Tier 2 – Cipher Break", "content": "Analyze and decrypt multi-layer encrypted payloads to retrieve operational passwords."},
                           {"title": "Tier 3 – Shadow Login", "content": "Execute final authentication using recovered credentials to breach the secured vault."}
                        ]
                    }
                ],
                "coordinators": [{"name": "Archana", "role": "Lead Moderator"}]
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
                "is_team_event": True,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 14, 0)),
                "time": "02:00 PM",
                "duration": "1 Hour",
                "prize": "₹500",
                "content_blocks": [
                    {
                        "title": "Mission Constraints",
                        "list": [
                            "Manual decryption using provided physical cipher keys.",
                            "Accuracy required for Name, Time, and Location extraction.",
                            "Pen and paper are your primary assets."
                        ]
                    }
                ],
                "coordinators": [
                    {"name": "Jenna", "role": "Security Specialist"},
                    {"name": "Anjal", "role": "Cryptography Lead"}
                ]
            },
            {
                "id": 997,
                "title": "The Last Login",
                "description": "Follow the digital trail. Find the truth. A digital forensics murder mystery challenge.",
                "venue": "Systems Lab",
                "category": "Digital Forensics",
                "requires_payment": True,
                "payment_amount": 50.00,
                "registration_limit": 45,
                "is_team_event": True,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 15, 0)),
                "time": "03:00 PM",
                "duration": "1 Hour 30 Mins",
                "prize": "₹500",
                "content_blocks": [],
                "coordinators": [{"name": "Laiqa", "role": "Coordinator"}],
                "image": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=2070"
            },
            {
                "id": 998,
                "title": "Buried Secrets",
                "description": "Follow the money, find the liar. A social deduction game of strategy and deception.",
                "venue": "Mech lab",
                "category": "Social Deduction",
                "requires_payment": True,
                "payment_amount": 25.00,
                "registration_limit": 26,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 13, 30)),
                "time": "01:30 PM",
                "duration": "2 Hours",
                "prize": "₹200",
                "content_blocks": [],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1541560052-5e3028e05d03?auto=format&fit=crop&q=80&w=2070"
            },
            {
                "id": 999,
                "title": "Barroz: Treasure Hunt",
                "description": "Unlock the mystery. Find the gold. A campus-wide treasure hunt.",
                "venue": "IETM Campus",
                "category": "Treasure Hunt",
                "requires_payment": True,
                "payment_amount": 10.00,
                "registration_limit": 24,
                "is_team_event": True,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 13, 30)),
                "time": "01:30 PM",
                "duration": "2 Hours",
                "prize": "₹300",
                "content_blocks": [],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1599939571322-792a326991f2?auto=format&fit=crop&q=80&w=2000"
            },
            {
                "id": 1000,
                "title": "8 Ball Pool",
                "description": "Chalk up and break. A pocket billiards tournament.",
                "venue": "court",
                "category": "Sports",
                "requires_payment": True,
                "payment_amount": 25.00,
                "registration_limit": 100,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 13, 30)),
                "time": "01:30 PM",
                "duration": "nil",
                "prize": "₹200",
                "content_blocks": [],
                "coordinators": [{"name": "Aakif", "role": "Coordinator"}],
                "image": "https://images.unsplash.com/photo-1588661803738-4e8913346d0d?auto=format&fit=crop&q=80&w=2066"
            },
            {
                "id": 1001,
                "title": "eFootball League",
                "description": "Settle it on the pitch. A mobile eSports knockout tournament.",
                "venue": "online",
                "category": "eSports",
                "requires_payment": True,
                "payment_amount": 10.00,
                "registration_limit": 100,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 14, 0)),
                "time": "online",
                "duration": "nil",
                "prize": "₹200",
                "content_blocks": [],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071"
            },
            {
                "id": 1002,
                "title": "Arm Wrestling",
                "description": "A test of strength and endurance. Two from each class.",
                "venue": "College entrance",
                "category": "Sports",
                "requires_payment": False,
                "payment_amount": 0.00,
                "registration_limit": 100,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 12, 30)),
                "time": "12:30 PM",
                "duration": "nil",
                "prize": "₹0",
                "content_blocks": [],
                "coordinators": [{"name": "Farhan", "role": "Coordinator"}],
                "image": "https://images.unsplash.com/photo-1583473848882-f9a5bb7ff2ee?auto=format&fit=crop&q=80&w=2070"
            },
            {
                "id": 1003,
                "title": "Mini Militia",
                "description": "Doodle Army 2: Mini Militia mobile war.",
                "venue": "-1 Lecture Hall",
                "category": "eSports",
                "requires_payment": True,
                "payment_amount": 10.00,
                "registration_limit": 100,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 13, 30)),
                "time": "01:30 PM",
                "duration": "1 Hour 30 Mins",
                "prize": "₹200",
                "content_blocks": [],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070"
            },
            {
                "id": 1004,
                "title": "Paper Toss",
                "description": "Precision and aim. Simple yet challenging paper toss competition.",
                "venue": "Front Porch",
                "category": "Fun",
                "requires_payment": True,
                "payment_amount": 10.00,
                "registration_limit": 100,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 27, 15, 0)),
                "time": "03:00 PM",
                "duration": "1 Hour",
                "prize": "₹100",
                "content_blocks": [],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1590402485294-219600ad9550?auto=format&fit=crop&q=80&w=2070"
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
                    "is_registration_open": event_data.get('is_registration_open', True),
                    "registration_start": timezone.now(),
                    "registration_end": event_data['event_date'],
                    "prize": event_data.get('prize', ''),
                    "content_blocks": event_data.get('content_blocks', []),
                    "coordinators": event_data.get('coordinators', []),
                    "time": event_data.get('time', ''),
                    "duration": event_data.get('duration', '')
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created event: {event.title} (ID: {event.id})"))
            else:
                self.stdout.write(self.style.SUCCESS(f"Updated event: {event.title} (ID: {event.id})"))
