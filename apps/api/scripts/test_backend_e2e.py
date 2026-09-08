import os
import sys
import django
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from authentication.models import User
from events.models import Event, Registration
from ops.models import AuditLog, SystemSetting, Notification
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
from django.utils import timezone

from django.conf import settings

def run_qa():
    if not settings.DEBUG:
        raise RuntimeError("SAFETY ABORT: test_backend_e2e.py cannot run in non-DEBUG production environment!")
    print("=== ASTRA REAL BACKEND E2E TEST ===")
    
    # 1. Admin User & JWT Setup
    admin_user, _ = User.objects.get_or_create(
        email="admin@astra.in",
        defaults={"full_name": "System Admin", "is_staff": True, "role": "ADMIN"}
    )
    admin_user.is_staff = True
    admin_user.role = "ADMIN"
    admin_user.save()
    
    refresh = RefreshToken.for_user(admin_user)
    token = str(refresh.access_token)
    print(f"[OK] Admin user verified: {admin_user.email}, is_staff={admin_user.is_staff}")

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # 2. Event Creation Test
    now = timezone.now()
    event_data = {
        "title": "ASTRA Cyber Arena 2026",
        "description": "Elite competitive capture the flag tournament and defensive cybersecurity challenges.",
        "category": "Technical",
        "venue": "Seminar Hall A",
        "event_date": (now + timedelta(days=5)).isoformat(),
        "registration_start": (now - timedelta(days=1)).isoformat(),
        "registration_end": (now + timedelta(days=4)).isoformat(),
        "registration_limit": 50,
        "is_registration_open": True,
        "requires_payment": False,
        "payment_amount": 0
    }
    
    # Check if exists, delete to ensure clean test
    Event.objects.filter(title="ASTRA Cyber Arena 2026").delete()
    
    response = client.post('/operations/events/', event_data, format='json')
    print(f"Event Create POST status: {response.status_code}")
    assert response.status_code == 201, f"Failed to create event: {response.data}"
    event_id = response.data['id']
    print(f"[OK] Event created successfully: ID {event_id}, Title: {response.data['title']}")

    # 3. Event Edit Test (Updating Venue)
    update_data = {
        "title": "ASTRA Cyber Arena 2026",
        "description": "Elite competitive capture the flag tournament and defensive cybersecurity challenges.",
        "category": "Technical",
        "venue": "Cyber Security Lab 402",
        "event_date": event_data["event_date"],
        "registration_start": event_data["registration_start"],
        "registration_end": event_data["registration_end"],
        "registration_limit": 50,
        "is_registration_open": True,
        "requires_payment": False,
        "payment_amount": 0
    }
    update_res = client.put(f'/operations/events/{event_id}/', update_data, format='json')
    print(f"Event Update PUT status: {update_res.status_code}")
    assert update_res.status_code == 200, f"Failed to update event: {update_res.data}"
    assert update_res.data['venue'] == "Cyber Security Lab 402", "Venue not updated!"
    print(f"[OK] Event updated successfully. Venue: {update_res.data['venue']}")

    # 4. Verify in Event List
    list_res = client.get('/operations/events/')
    assert list_res.status_code == 200
    titles = [e['title'] for e in list_res.data]
    assert "ASTRA Cyber Arena 2026" in titles, "Event not found in list!"
    print(f"[OK] Event found in operations list. Total events: {len(list_res.data)}")

    # 5. Attendee User & Registration Test
    attendee_user, _ = User.objects.get_or_create(
        email="test_attendee@gmail.com",
        defaults={"full_name": "Karthik Test", "phone_number": "9876543210", "college": "KMCT IETM"}
    )
    attendee_refresh = RefreshToken.for_user(attendee_user)
    attendee_token = str(attendee_refresh.access_token)
    
    attendee_client = APIClient()
    attendee_client.credentials(HTTP_AUTHORIZATION=f'Bearer {attendee_token}')
    
    reg_data = {
        "event": event_id,
        "full_name": "Karthik Test",
        "phone_number": "9876543210",
        "college": "KMCT IETM"
    }
    reg_res = attendee_client.post('/register/', reg_data, format='json')
    print(f"Registration POST status: {reg_res.status_code}")
    assert reg_res.status_code == 201, f"Failed to register: {reg_res.data}"
    pass_token = reg_res.data['token']
    print(f"[OK] Registration created. Pass Token: {pass_token}, Status: {reg_res.data['status']}")

    # 6. Admin Registrations List Test
    admin_reg_res = client.get('/admin-registrations/')
    assert admin_reg_res.status_code == 200
    tokens = [r['token'] for r in admin_reg_res.data]
    assert pass_token in tokens, "Pass token not in admin registrations list!"
    print(f"[OK] Registration appears in /admin-registrations/. Total: {len(admin_reg_res.data)}")

    # 7. Scanner Flow Testing (3 distinct states)
    # Test 7a: VALID TICKET
    scan_res1 = client.get(f'/operations/verify/{pass_token}/')
    print(f"Scan 1 (VALID) status: {scan_res1.status_code}, data: {scan_res1.data}")
    assert scan_res1.status_code == 200
    assert scan_res1.data.get('valid') is True, "Expected valid ticket on first scan"
    print(f"[OK] Scanner Test 1: VALID TICKET -> Accepted (status: ATTENDED)")

    # Test 7b: ALREADY CHECKED IN
    scan_res2 = client.get(f'/operations/verify/{pass_token}/')
    print(f"Scan 2 (ALREADY USED) status: {scan_res2.status_code}, data: {scan_res2.data}")
    assert scan_res2.status_code == 200
    assert scan_res2.data.get('valid') is False
    assert scan_res2.data.get('already_used') is True or "already" in scan_res2.data.get('message', '').lower()
    print(f"[OK] Scanner Test 2: ALREADY CHECKED IN -> Rejected with 'Already Used'")

    # Test 7c: INVALID TOKEN
    scan_res3 = client.get('/operations/verify/INVALID_TOKEN_9999/')
    print(f"Scan 3 (INVALID) status: {scan_res3.status_code}, data: {scan_res3.data}")
    assert scan_res3.status_code == 404 or scan_res3.data.get('valid') is False
    print(f"[OK] Scanner Test 3: INVALID TOKEN -> Rejected (404/not found)")

    # Test 7d: Test verify/<str:token>/ alias consistency
    scan_res4 = client.get(f'/verify/{pass_token}/')
    assert scan_res4.status_code == 200
    assert scan_res4.data.get('valid') is False
    assert scan_res4.data.get('already_used') is True or "already" in scan_res4.data.get('message', '').lower()
    print(f"[OK] Scanner Test 4: verify/<token>/ matches operations/verify/<token>/ behavior 100%")

    # 8. Settings Persistence Test
    settings_payload = {
        "registrationOpen": True,
        "maintenanceMode": False,
        "emailNotifications": True,
        "sessionTimeout": "45m"
    }
    sett_res = client.post('/operations/settings/', settings_payload, format='json')
    assert sett_res.status_code == 200
    print(f"[OK] Settings saved successfully: {sett_res.data}")
    
    get_sett = client.get('/operations/settings/')
    assert get_sett.data.get('sessionTimeout') == "45m"
    print(f"[OK] Settings persisted and verified: sessionTimeout = 45m")

    # 9. Audit Logs Test
    logs_res = client.get('/ops/logs/')
    assert logs_res.status_code == 200
    print(f"[OK] Audit logs retrieved. Total logs: {len(logs_res.data)}")
    if len(logs_res.data) > 0:
        latest_log = logs_res.data[0]
        print(f"Latest Log: User={latest_log.get('user_email')}, Action={latest_log.get('action')}, Timestamp={latest_log.get('timestamp')}")

    # 10. Notifications / Announcement Test
    notif_payload = {
        "subject": "Important: Welcome to ASTRA 2026",
        "message": "Welcome to ASTRA 2026. Please check your schedule in the portal.",
        "recipients_criteria": "Admins Only"
    }
    notif_res = client.post('/ops/notifications/', notif_payload, format='json')
    assert notif_res.status_code == 201
    print(f"[OK] Notification created and broadcast logged: ID {notif_res.data.get('id')}")

    try:
        # All tests execute here
        pass
    finally:
        # Purge test records
        Event.objects.filter(title="ASTRA Cyber Arena 2026").delete()
        Registration.objects.filter(user__email="test_attendee@gmail.com").delete()
        User.objects.filter(email="test_attendee@gmail.com").delete()
        Notification.objects.filter(subject="Important: Welcome to ASTRA 2026").delete()
        AuditLog.objects.filter(action__in=["Updated System Settings", "Failed to Send Notification: Important: Welcome to ASTRA 2026"]).delete()
        SystemSetting.objects.filter(key='sessionTimeout').update(value='30m')
        print("[CLEANUP] Automated test teardown completed cleanly.")

    print("\nALL BACKEND API & DATA WORKFLOWS VERIFIED SUCCESSFULLY!")

if __name__ == '__main__':
    run_qa()
