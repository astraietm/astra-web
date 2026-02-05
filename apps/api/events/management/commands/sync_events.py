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
                "title": "HAWKINS LAB",
                "description": "Lost Login: A Stranger Things–themed cyber mystery event where teams solve clues, analyze patterns, and complete tasks to progress through an immersive storyline.",
                "venue": "BCA lab",
                "category": "Cyber Mystery",
                "requires_payment": False,
                "payment_amount": 0.00,
                "registration_limit": 24,
                "is_team_event": True,
                "event_date": timezone.make_aware(datetime(2026, 2, 13, 10, 0)),
                "prize": "Merit Certificates",
                "time": "10:00 AM",
                "duration": "2 Hours",
                "content_blocks": [
                    {
                        "title": "Mission Briefing",
                        "content": "LOST LOGIN - ENTER THE UPSIDE DOWN! This event is task-based and story-driven, inspired by cybersecurity concepts such as data accuracy, signal analysis, social engineering, and authentication, presented in a safe, fun, and interactive simulation.",
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
                            "Team Size: 4 members per squad.",
                            "Capacity: Restricted to 6 Teams only.",
                            "Sequential Protocol: 5 Levels - 5 PCs. Levels must be completed in order.",
                            "PC Order: Teams must strictly follow the assigned hardware sequence.",
                            "System Use: Only provided systems/terminals may be used for the mission.",
                            "No team changes are permitted once the countdown begins."
                        ]
                    },
                    {
                        "title": "Mission Outcome",
                        "content": "Fastest team to successfully navigate all 5 levels and execute the final override wins. No advanced technical knowledge is required—all students are authorized to participate."
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
                "event_date": timezone.make_aware(datetime(2026, 2, 12, 11, 0)),
                "prize": "₹500",
                "content_blocks": [
                    {
                        "title": "Protocol Structure",
                        "items": [
                           {"title": "Tier 1 – Hash Hunt", "content": "Identify the correct plaintext from provided hashes to unlock system credentials."},
                           {"title": "Tier 2 – Cipher Break", "content": "Analyze and decrypt multi-layer encrypted payloads to retrieve operational passwords."},
                           {"title": "Tier 3 – Shadow Login", "content": "Execute final authentication using recovered credentials to breach the secured vault."}
                        ]
                    },
                    {
                        "title": "Operational Rules",
                        "list": [
                            "Individual participation strictly enforced.",
                            "Restricted internet access permitted for decryption research.",
                            "Zero-tolerance policy for credential sharing.",
                            "Speed and accuracy determine ranking."
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
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 12, 14, 0)),
                "prize": "₹500",
                "content_blocks": [
                    {
                        "title": "The Intelligence Mission",
                        "content": "A high-value terminal has been seized. Communication logs are encrypted with a custom randomized monoalphabetic standard. Your task is to perform an offline manual override."
                    },
                    {
                        "title": "Mission Constraints",
                        "list": [
                            "Strict offline environment — no digital solvers allowed.",
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
        ]

        # Add new events for syncing
        new_events = [
            {
                "id": 997,
                "title": "The Last Login",
                "description": "Follow the digital trail. Find the truth. A digital forensics murder mystery challenge.",
                "venue": "Computer Lab",
                "category": "Digital Forensics",
                "requires_payment": True,
                "payment_amount": 60.00,
                "registration_limit": 30,
                "is_team_event": True,
                "team_size_min": 2,
                "team_size_max": 3,
                "event_date": timezone.make_aware(datetime(2026, 2, 11, 15, 0)),
                "time": "03:00 PM",
                "duration": "1 Hour 30 Mins",
                "prize": "₹1000",
                "content_blocks": [
                    {
                        "title": "Event Structure",
                        "items": [
                           {"title": "Round 1 – Lock & Key", "content": "Solve short logic and observation challenges. Each correct answer reveals one digit. Arrange all digits in order to unlock the final code. Only teams that crack the code qualify."},
                           {"title": "Round 2 – Investigation", "content": "Access the digital case files. Analyze evidence carefully. Not all files are important. Some clues may mislead you."},
                           {"title": "Round 3 – Final Verdict", "content": "Submit: Culprit’s name, Motive, Method, Minimum two supporting clues."}
                        ]
                    },
                    {
                        "title": "Scoring",
                        "list": [
                            "Correct suspect – 30",
                            "Correct motive – 20",
                            "Correct method – 20",
                            "Valid evidence – 20",
                            "Time efficiency – 10",
                            "Total – 100"
                        ]
                    }
                ],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=2070"
            },
            {
                "id": 998,
                "title": "Buried Secrets",
                "description": "Follow the money, find the liar. A social deduction game of strategy and deception.",
                "venue": "Main Venue",
                "category": "Social Deduction",
                "requires_payment": True,
                "payment_amount": 50.00,
                "registration_limit": 13,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 11, 15, 0)),
                "time": "03:00 PM",
                "duration": "1 Hour",
                "prize": "₹1000",
                "content_blocks": [
                    {
                        "title": "Game Structure",
                        "content": "Total players: 13. Roles: 3 Mafia, 1 Doctor, 1 Detective, 1 Broker, remaining players are Civilians. The game consists of 4 total rounds.",
                        "items": [
                           {"title": "Hidden Phase (5 mins)", "content": "The coordinator blindfolds all players. The Mafia secretly hide the treasure within the venue and return without revealing themselves."},
                           {"title": "The Hunt (5 mins)", "content": "All players search the venue to find the treasure."},
                           {"title": "Elimination Phase", "content": "Players proceed into night and day cycles to remove suspects."}
                        ]
                    }
                ],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1541560052-5e3028e05d03?auto=format&fit=crop&q=80&w=2070"
            },
            {
                "id": 999,
                "title": "Barroz: Treasure Hunt",
                "description": "Unlock the mystery. Find the gold. A campus-wide treasure hunt.",
                "venue": "Campus Grounds",
                "category": "Treasure Hunt",
                "requires_payment": False,
                "payment_amount": 0.00,
                "registration_limit": 40,
                "is_team_event": True,
                "team_size_min": 1,
                "team_size_max": 4,
                "event_date": timezone.make_aware(datetime(2026, 2, 11, 15, 0)),
                "time": "03:00 PM",
                "duration": "2 Hours",
                "prize": "Winner Takes All",
                "content_blocks": [
                    {
                        "title": "Winning & Prizes",
                        "list": [
                            "The first team to correctly solve all clues and reach the final treasure within the time limit wins.",
                            "Time limit: 2 hours.",
                            "Tie-breaker: Fastest time on key checkpoints."
                        ]
                    }
                ],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1599939571322-792a326991f2?auto=format&fit=crop&q=80&w=2000"
            },
            {
                "id": 1000,
                "title": "8 Ball Pool",
                "description": "Chalk up and break. A 2v2 knockout tournament.",
                "venue": "Recreation Hall",
                "category": "Sports",
                "requires_payment": False,
                "payment_amount": 0.00,
                "registration_limit": 16,
                "is_team_event": True,
                "team_size_min": 2,
                "team_size_max": 2,
                "event_date": timezone.make_aware(datetime(2026, 2, 11, 13, 30)),
                "time": "01:30 PM",
                "duration": "1 Hour 30 Mins",
                "prize": "Trophies",
                "content_blocks": [
                    {
                        "title": "Tournament Format",
                        "content": "Knockout format with 8 teams starting from the quarterfinals. All matches are Best of 1, except the Final which is Best of 3."
                    }
                ],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1588661803738-4e8913346d0d?auto=format&fit=crop&q=80&w=2066"
            },
            {
                "id": 1001,
                "title": "eFootball League",
                "description": "Settle it on the pitch. A mobile eSports knockout tournament.",
                "venue": "S4 Cyber",
                "category": "eSports",
                "requires_payment": True,
                "payment_amount": 10.00,
                "registration_limit": 32,
                "is_team_event": False,
                "event_date": timezone.make_aware(datetime(2026, 2, 11, 14, 0)),
                "time": "02:00 PM",
                "duration": "2 Hours",
                "prize": "1st: 50% Pool, 2nd: 30% Pool",
                "content_blocks": [
                    {
                        "title": "Rules",
                        "list": [
                            "Knockout Format Tournament.",
                            "Match Time: 8 Mins.",
                            "Team Strength: Unlimited.",
                            "Player Form: Random."
                        ]
                    }
                ],
                "coordinators": [],
                "image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071"
            }
        ]

        events_to_sync.extend(new_events)

        for event_data in events_to_sync:
            # Map time/duration for sync
            if event_data['id'] == 995:
                event_data['time'] = "11:00 AM"
                event_data['duration'] = "1.5 Hours"
            elif event_data['id'] == 996:
                event_data['time'] = "02:00 PM"
                event_data['duration'] = "1 Hour"

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
