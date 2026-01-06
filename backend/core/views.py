from django.http import JsonResponse


def health(request):
    """
    Simple health check endpoint for UptimeRobot.
    """
    return JsonResponse({"status": "ok"})


