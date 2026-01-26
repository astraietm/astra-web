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
    Sends a confirmation email with QR code ticket to the registered user.
    Uses existing QR code generation from serializer.
    """
    user = registration.user
    event = registration.event
    
    # 1. Generate QR Code using existing utility
    qr_code_base64 = generate_qr_code(registration.token, color="#000000")
    
    # Convert base64 data URL to bytes for email attachment
    import base64
    import re
    # Extract base64 data from data URL (format: data:image/png;base64,...)
    base64_data = re.sub('^data:image/.+;base64,', '', qr_code_base64)
    qr_image_bytes = base64.b64decode(base64_data)
    
    # 2. Prepare Email Content
    subject = f"🎟️ Your Ticket for {event.title} - ASTRA IETM"
    
    # Format date nicely
    from django.utils.dateformat import format as date_format
    event_date_formatted = date_format(event.event_date, 'l, F j, Y')
    event_time_formatted = date_format(event.event_date, 'g:i A')
    
    # Team info if applicable
    team_info = ""
    if registration.team_name:
        team_info = f"""
        <div style="background-color: #EEF2FF; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #6366F1;">
            <p style="margin: 0; color: #4F46E5;"><strong>🏆 Team Name:</strong> {registration.team_name}</p>
        </div>
        """
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    ✨ Registration Confirmed!
                </h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">
                    Your ticket is ready
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi <strong>{user.full_name or user.email}</strong>,
                </p>
                
                <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                    You're all set! Your registration for <strong style="color: #6366F1;">{event.title}</strong> has been confirmed.
                </p>
                
                {team_info}
                
                <!-- Event Details Card -->
                <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                    <h3 style="color: #111827; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                        📅 Event Details
                    </h3>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 30%;">Date</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">{event_date_formatted}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">{event_time_formatted}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Venue</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">{event.venue}</td>
                        </tr>
                    </table>
                </div>
                
                <!-- QR Code Ticket Section -->
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                        🎫 Your Entry Pass
                    </h3>
                    <p style="color: #075985; font-size: 14px; margin: 0 0 20px 0;">
                        Show this QR code at the entrance (also attached as image)
                    </p>
                    <div style="background-color: #ffffff; display: inline-block; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                        <img src="cid:qr_ticket" alt="Event QR Code Ticket" style="width: 220px; height: 220px; display: block;" />
                    </div>
                    <p style="color: #64748b; font-size: 12px; margin: 15px 0 0 0; font-family: 'Courier New', monospace;">
                        Token: {registration.token[:16]}...
                    </p>
                </div>
                
                <!-- Important Notice -->
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 25px 0;">
                    <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;">
                        <strong>⚠️ Important:</strong> Please arrive 15 minutes early and bring a valid ID. Download the attached QR code or take a screenshot for entry.
                    </p>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://astraietm.in/events/{event.id}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                        View Event Details
                    </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    Questions? Contact us at <a href="mailto:support@astraietm.in" style="color: #6366F1; text-decoration: none;">support@astraietm.in</a>
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px 0;">
                    ASTRA - Indian Institute of Engineering Science and Technology
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2026 ASTRA IETM. All rights reserved.
                </p>
            </div>
            
        </div>
    </body>
    </html>
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
    
    # 4. Attach QR Code (both inline for email body and as downloadable attachment)
    # Inline for email body display
    qr_inline = MIMEImage(qr_image_bytes)
    qr_inline.add_header('Content-ID', '<qr_ticket>')
    qr_inline.add_header('Content-Disposition', 'inline', filename='qr_code.png')
    email.attach(qr_inline)
    
    # Also attach as separate downloadable file
    email.attach(
        f'ASTRA_Ticket_{event.title.replace(" ", "_")}_{registration.token[:8]}.png',
        qr_image_bytes,
        'image/png'
    )
    
    # 5. Send in Background Thread
    EmailThread = threading.Thread(target=send_email_thread, args=(email,))
    EmailThread.start()
    
    return True
