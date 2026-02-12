# Django Admin Not Showing Updated Event Time from Supabase

## Problem
You changed the `time` field value for an event in Supabase directly, but Django admin still shows the old value. Other fields update correctly, but specifically the `time` field doesn't.

## Root Cause
The `time` field was NOT included in the `list_display` of the EventAdmin class, so it wasn't visible in the admin list view. This meant you could only see it in the detail/edit form, which gets cached by the browser.

## ✅ Fix Applied
I've updated `apps/api/events/admin.py` to:
1. Add `time` to the `list_display` - now you can see it in the event list
2. Add explicit `fields` configuration to ensure proper ordering and editability

## Quick Fixes (Try in Order)

### 1. Hard Refresh Browser (Easiest)
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`
- This clears browser cache for the page

### 2. Clear Django Session & Logout/Login
1. In Django admin, click **Logout**
2. Close all browser tabs with Django admin
3. Clear browser cookies for the admin site
4. Login again

### 3. Restart Django Server
If running locally:
```bash
# Stop the server (Ctrl+C)
# Then restart
python manage.py runserver
```

If on Render:
1. Go to Render Dashboard
2. Click on your backend service
3. Click **Manual Deploy** → **Clear build cache & deploy**

### 4. Reduce Database Connection Pooling (Temporary)

Edit `apps/api/core/settings.py` line 98 and change:
```python
# FROM:
conn_max_age=600,

# TO:
conn_max_age=0,  # Disable connection pooling temporarily
```

This forces Django to create a fresh database connection for each request.

### 5. Force Refresh in Django Admin Code

Add this to `apps/api/events/admin.py` in the `EventAdmin` class:

```python
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'venue', 'category', 'time', 'is_registration_open', 'requires_payment', 'payment_amount')
    search_fields = ('title', 'venue')
    list_filter = ('is_registration_open', 'category', 'requires_payment')
    
    # Add this method to disable caching
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Force fresh query from database
        return qs.select_for_update(skip_locked=True).all()
```

## Verify the Change

1. Open Django admin
2. Go to Events list
3. Check if the `time` field now shows the updated value
4. If still not showing, check the actual database value:

```bash
# Connect to your Django shell
python manage.py shell

# Run this:
from events.models import Event
event = Event.objects.get(id=YOUR_EVENT_ID)  # Replace with actual ID
print(f"Time: {event.time}")
```

## Root Cause

Django uses connection pooling (`conn_max_age=600` means connections are reused for 10 minutes). During this time, some database drivers may cache query results or maintain stale connections.

## Permanent Fix

If this happens frequently, consider:
1. Reducing `conn_max_age` to a lower value (e.g., 60 seconds)
2. Always making changes through Django admin instead of directly in Supabase
3. Using Django's ORM to update data ensures cache invalidation works properly
