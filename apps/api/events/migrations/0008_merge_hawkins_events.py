from django.db import migrations

def merge_hawkins_events(apps, schema_editor):
    Event = apps.get_model('events', 'Event')
    Registration = apps.get_model('events', 'Registration')
    Payment = apps.get_model('events', 'Payment')
    
    # 1. Find all Hawkins events (case insensitive)
    hawkins_events = Event.objects.filter(title__icontains='hawkins').order_by('id')
    
    if hawkins_events.count() <= 1:
        # If there's 1 or 0, just ensure the name is correct for the one that exists
        if hawkins_events.exists():
            event = hawkins_events.first()
            if event.title != 'Hawkins Lab':
                event.title = 'Hawkins Lab'
                event.save()
        return

    # 2. Pick the first one as the master (usually the oldest or the one with most registrations)
    # We'll use the one named exactly "Hawkins Lab" if it exists, else the first one.
    master_event = hawkins_events.filter(title='Hawkins Lab').first() or hawkins_events.first()
    
    # Ensure master event has the correct title
    master_event.title = 'Hawkins Lab'
    master_event.save()
    
    # 3. Move all registrations from other Hawkins events to the master event
    other_events = hawkins_events.exclude(id=master_event.id)
    
    for old_event in other_events:
        # Check for potential unique constraint violations (user, event)
        # If a user is registered for both, we keep the one in master or merge them.
        for reg in Registration.objects.filter(event=old_event):
            if Registration.objects.filter(user=reg.user, event=master_event).exists():
                # User already has a registration in the master event.
                # If this one is confirmed but the master one is pending, swap them or just delete this one.
                # For safety, let's just delete the duplicate and log it (implicitly via skip).
                # But actually, registrations are important. 
                # Let's see if we can move the payment too.
                master_reg = Registration.objects.get(user=reg.user, event=master_event)
                if reg.status in ['REGISTERED', 'ATTENDED'] and master_reg.status == 'PENDING':
                    # Swap status and move payment
                    master_reg.status = reg.status
                    master_reg.token = reg.token
                    master_reg.save()
                    if hasattr(reg, 'payment'):
                        p = reg.payment
                        p.registration = master_reg
                        p.save()
                reg.delete()
            else:
                # Safe to move
                reg.event = master_event
                reg.save()
        
        # 4. Optional: Delete the old event record
        old_event.delete()

class Migration(migrations.Migration):
    dependencies = [
        ('events', '0007_event_duration_event_time'),
    ]

    operations = [
        migrations.RunPython(merge_hawkins_events),
    ]
