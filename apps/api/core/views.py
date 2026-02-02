from django.http import JsonResponse
from django.db import connection

def health(request):
    """
    Health check endpoint for UptimeRobot.
    Also pings the DB to keep the connection pool warm.
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "ok"
    except Exception:
        db_status = "error"

    return JsonResponse({"status": "ok", "db": db_status})


