import base64
import threading
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .utils import generate_qr_code

class EmailThread(threading.Thread):
    def __init__(self, email_message):
        self.email_message = email_message
        threading.Thread.__init__(self)

    def run(self):
        try:
            self.email_message.send()
        except Exception as e:
            print(f"Failed to send email: {e}")

def send_registration_email(registration):
    """
    Sends a registration confirmation email with QR code attachment.
    Run asynchronously using threading to avoid blocking the API.
    """
    try:
        user = registration.user
        event = registration.event
        
        # 1. Generate QR Code bytes
        qr_data_uri = generate_qr_code(registration.token) # "data:image/png;base64,..."
        # Extract base64 part
        base64_str = qr_data_uri.split(',')[1]
        qr_bytes = base64.b64decode(base64_str)
        
        # 2. Prepare Email Content
        subject = f"Registration Confirmed: {event.title}"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [user.email]
        
        # Context for template
        context = {
            'user_name': user.full_name or user.email.split('@')[0],
            'event_title': event.title,
            'event_date': event.event_date.strftime("%B %d, %Y at %I:%M %p"),
            'venue': event.venue,
            'token': registration.token,
            'qr_cid': 'qrcode_img', # Content-ID for inline image
        }
        
        # Simple HTML Template (Inline for simplicity, or use loader)
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #00ff9d; background: #000; padding: 15px; border-radius: 5px; text-align: center;">Registration Confirmed!</h2>
                    <p>Hi <strong>{context['user_name']}</strong>,</p>
                    <p>You have successfully registered for <strong>{context['event_title']}</strong>.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Date:</strong> {context['event_date']}</p>
                        <p><strong>Venue:</strong> {context['venue']}</p>
                        <p><strong>Entry Token:</strong> <code style="background: #eee; padding: 2px 5px; border-radius: 3px;">{context['token']}</code></p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p>Show this QR code at the entrance:</p>
                        <img src="cid:{context['qr_cid']}" alt="Entry QR Code" style="width: 200px; height: 200px; border: 2px solid #000; border-radius: 10px;"/>
                    </div>
                    
                    <p style="font-size: 12px; color: #888; text-align: center;">
                        If you cannot view the QR code, please keep this email handy or take a screenshot of your <a href="https://astraietm.in/dashboard">Dashboard</a>.
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_content = strip_tags(html_content)
        
        # 3. Create Email Object
        email = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        email.attach_alternative(html_content, "text/html")
        
        # 4. Attach QR Code (Inline)
        # We attach it as a related inline image so it displays inside the HTML <img> tag
        email.attach('qrcode.png', qr_bytes, 'image/png')
        
        # For CID to work, we need to create an email message with Mixed/Related subtypes.
        # However, standard attach() puts it as attachment.
        # To make it inline, we need to set Content-ID.
        # Doing standard attachment is safer for broad client support if CID is tricky without MIMEImage.
        # Let's rely on standard attachment for now, but referenced by CID needs specific headers.
        
        # Re-doing attachment for CID support:
        from email.mime.image import MIMEImage
        img = MIMEImage(qr_bytes)
        img.add_header('Content-ID', f"<{context['qr_cid']}>")
        img.add_header('Content-Disposition', 'inline', filename='qrcode.png')
        email.attach(img)
        
        # 5. Send (Threaded)
        EmailThread(email).start()
        return True

    except Exception as e:
        print(f"Error preparing email: {e}")
        return False
