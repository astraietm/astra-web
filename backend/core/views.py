from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings

def health(request):
    """
    Simple health check endpoint for UptimeRobot.
    """
    return JsonResponse({"status": "ok"})

def test_email(request):
    """
    Debug endpoint to test email configuration and return actual errors.
    """
    try:
        # Send to the configured host user (self-test)
        recipient = settings.EMAIL_HOST_USER or "astraietm25@gmail.com"
        
        send_mail(
            subject='Astra SMTP Configuration Test',
            message=f'If you received this, your email configuration is correct.\n\nSettings used:\nHost: {settings.EMAIL_HOST}\nPort: {settings.EMAIL_PORT}\nUser: {settings.EMAIL_HOST_USER}\nFrom: {settings.DEFAULT_FROM_EMAIL}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
        return JsonResponse({
            "status": "success", 
            "message": "Email sent successfully!", 
            "recipient": recipient,
            "debug_info": {
                "EMAIL_HOST": settings.EMAIL_HOST,
                "EMAIL_PORT": settings.EMAIL_PORT,
                "EMAIL_HOST_USER": settings.EMAIL_HOST_USER,
                "DEFAULT_FROM_EMAIL": settings.DEFAULT_FROM_EMAIL
            }
        })
    except Exception as e:
        print(f"EMAIL TEST ERROR: {e}") # Log to backend console
        return JsonResponse({
            "status": "error", 
            "error_type": type(e).__name__,
            "message": str(e),
            "debug_info": {
                "EMAIL_HOST": settings.EMAIL_HOST,
                "EMAIL_PORT": settings.EMAIL_PORT,
                "EMAIL_HOST_USER": settings.EMAIL_HOST_USER,
                "DEFAULT_FROM_EMAIL": settings.DEFAULT_FROM_EMAIL
            }
        }, status=200) # Force 200 to ensure JSON is shown in browser
