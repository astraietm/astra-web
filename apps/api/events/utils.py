import qrcode
import io
import base64

def generate_qr_code(token, color="#000000"):
    """
    Generate an ultra-premium, professional QR code.
    Encodes the full verification URL and supports branding colors.
    """
    # Professional verification URL
    base_url = "https://astraietm.in/verify"
    data = f"{base_url}/{token}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M, # M is cleaner for branding
        box_size=12, # Slightly larger for crispness
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    # Use RGB for coloring
    try:
        # Convert hex to RGB tuples
        fill_color = color
        back_color = "white"
        
        img = qr.make_image(fill_color=fill_color, back_color=back_color).convert('RGB')
        
        # Buffer it for response
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        print(f"QR Gen Error: {e}")
        # Robust fallback to standard black/white
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{img_str}"

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from email.mime.image import MIMEImage

import threading
import sys

def send_email_thread(email):
    try:
        print(f"Starting email send to {email.to}...", flush=True)
        email.send()
        print(f"Email sent successfully to {email.to}", flush=True)
    except Exception as e:
        print(f"CRITICAL ERROR sending email: {str(e)}", file=sys.stderr, flush=True)

def send_registration_email(registration):
    """
    Sends a confirmation email with a QR code to the registered user via a background thread.
    """
    user = registration.user
    event = registration.event
    
    # 1. Generate QR Code (Raw Bytes for Email Attachment)
    # Using 'token' instead of non-existent 'registration_id'
    qr_data = f"registration_token:{registration.token}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    qr_image_data = buffer.getvalue()
    
    # 2. Prepare Email Content
    subject = f"Registration Confirmed: {event.title}"
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #6C63FF; text-align: center;">Registration Confirmed!</h2>
        <p>Hi <strong>{user.full_name}</strong>,</p>
        <p>You have successfully registered for <strong>{event.title}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Date:</strong> {event.event_date}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Confirmation Token:</strong> {registration.token}</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <p>Please show this QR code at the entrance:</p>
            <img src="cid:qrcode_image" alt="Event QR Code" style="width: 200px; height: 200px; border: 1px solid #ccc; padding: 5px;" />
        </div>
        
        <p style="text-align: center; font-size: 12px; color: #888;">
            &copy; 2026 Astra IETM. All Rights Reserved.
        </p>
    </div>
    """
    text_content = strip_tags(html_content)
    
    # 3. Create Email Message
    email = EmailMultiAlternatives(
        subject,
        text_content,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )
    email.attach_alternative(html_content, "text/html")
    
    # 4. Attach QR Code
    image = MIMEImage(qr_image_data)
    image.add_header('Content-ID', '<qrcode_image>')
    image.add_header('Content-Disposition', 'inline', filename='qrcode.png')
    email.attach(image)
    
    # 5. Send in Background Thread
    EmailThread = threading.Thread(target=send_email_thread, args=(email,))
    EmailThread.start()
    
    return True
