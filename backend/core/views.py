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
        
        # DEBUG DNS
        import socket
        try:
            addr_info = socket.getaddrinfo(settings.EMAIL_HOST, settings.EMAIL_PORT)
            dns_debug = [x[4] for x in addr_info]
        except Exception as dns_e:
            dns_debug = str(dns_e)
        
        from django.core.mail import get_connection, EmailMessage

        # FORCE IPv4 HACK: Render sometimes has broken IPv6 but resolves AAA records
        # leading to "Network is unreachable". We monkey-patch getaddrinfo to block IPv6.
        orig_getaddrinfo = socket.getaddrinfo
        def getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
            return orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)

        socket.getaddrinfo = getaddrinfo_ipv4
        try:
            # Use explicit connection with 5-second timeout
            connection = get_connection(timeout=5)
            
            email = EmailMessage(
                subject='Astra SMTP Configuration Test',
                body=f'If you received this, your email configuration is correct.\n\nSettings used:\nHost: {settings.EMAIL_HOST}\nPort: {settings.EMAIL_PORT}\nUser: {settings.EMAIL_HOST_USER}\nFrom: {settings.DEFAULT_FROM_EMAIL}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
                connection=connection
            )
            email.send(fail_silently=False)
        finally:
            # RESTORE Original getaddrinfo
            socket.getaddrinfo = orig_getaddrinfo
        return JsonResponse({
            "status": "success", 
            "message": "Email sent successfully!", 
            "recipient": recipient,
            "debug_info": {
                "DNS_DEBUG": dns_debug,
                "EMAIL_HOST": settings.EMAIL_HOST,
                "EMAIL_PORT": settings.EMAIL_PORT,
                "EMAIL_USE_SSL": getattr(settings, 'EMAIL_USE_SSL', 'Unknown'),
                "EMAIL_USE_TLS": getattr(settings, 'EMAIL_USE_TLS', 'Unknown'),
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
                "DNS_DEBUG": dns_debug,
                "EMAIL_HOST": settings.EMAIL_HOST,
                "EMAIL_PORT": settings.EMAIL_PORT,
                "EMAIL_USE_SSL": getattr(settings, 'EMAIL_USE_SSL', 'Unknown'),
                "EMAIL_USE_TLS": getattr(settings, 'EMAIL_USE_TLS', 'Unknown'),
                "EMAIL_HOST_USER": settings.EMAIL_HOST_USER,
                "DEFAULT_FROM_EMAIL": settings.DEFAULT_FROM_EMAIL
            }
        }, status=200) # Force 200 to ensure JSON is shown in browser
