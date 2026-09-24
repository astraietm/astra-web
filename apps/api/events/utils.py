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

from django.utils.html import strip_tags
from django.conf import settings

import threading
import logging
import base64

logger = logging.getLogger(__name__)


def _send_email_in_thread(payload):
    """Background thread target — calls Resend HTTP API and logs result."""
    try:
        import resend
        resend.api_key = settings.RESEND_API_KEY
        response = resend.Emails.send(payload)
        logger.info(f"[EMAIL] Resend delivered: id={response.get('id')} to={payload.get('to')}")
    except Exception as e:
        logger.error(f"[EMAIL] Resend failed for {payload.get('to')}: {e}", exc_info=True)


def send_registration_email(registration):
    """
    Send a registration confirmation email with the full ticket pass PNG attached.
    Uses Resend HTTP API — works on Render free tier (no SMTP ports needed).
    Dispatched in a background daemon thread so it doesn't block the API response.
    """
    try:
        user = registration.user
        event = registration.event
        logger.info(f"[EMAIL] Preparing email for registration #{registration.id} — {user.email}")

        # ── 1. Generate the ticket pass PNG ─────────────────────────────
        from .ticket_generator import generate_ticket_png
        ticket_png_bytes = generate_ticket_png(registration)
        logger.info(f"[EMAIL] Ticket PNG generated ({len(ticket_png_bytes)} bytes)")

        # ── 2. Build a clean HTML email body ────────────────────────────
        from django.utils.dateformat import format as date_format

        event_date_fmt = date_format(event.event_date, 'l, F j, Y') if event.event_date else 'TBA'
        event_time_fmt = getattr(event, 'time', '') or (date_format(event.event_date, 'g:i A') if event.event_date else 'TBA')

        subject = f"🎟️ Your Ticket for {event.title} — ASTRA IETM"

        html_content = f"""\
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:36px 30px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">✨ Registration Confirmed!</h1>
    <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;font-size:15px;">Your ticket pass is attached below</p>
  </div>

  <!-- Body -->
  <div style="padding:36px 30px;">
    <p style="color:#1f2937;font-size:16px;margin:0 0 18px;">Hi <strong>{user.full_name or user.email}</strong>,</p>
    <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 28px;">
      You're all set! Your registration for <strong style="color:#6366F1;">{event.title}</strong> has been confirmed.
      Your official entry ticket pass is <strong>attached as a PNG image</strong> — save it to your phone or print it out.
    </p>

    <!-- Event Details -->
    <div style="background:#f9fafb;border:2px solid #e5e7eb;border-radius:12px;padding:22px;margin:0 0 28px;">
      <h3 style="color:#111827;margin:0 0 16px;font-size:17px;">📅 Event Details</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;width:30%;">Event</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">{event.title}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Date</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">{event_date_fmt}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Time</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">{event_time_fmt}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Venue</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">{event.venue}</td>
        </tr>
      </table>
    </div>

    <!-- Important -->
    <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px;border-radius:6px;margin:0 0 28px;">
      <p style="color:#92400e;font-size:13px;margin:0;line-height:1.5;">
        <strong>⚠️ Important:</strong> Please arrive 15 minutes early. Present the attached ticket (QR code) at the check-in desk for entry.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0;">
      <a href="https://astraietm.in/dashboard" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;padding:13px 30px;border-radius:8px;font-weight:600;font-size:15px;">
        View My Registrations
      </a>
    </div>

    <p style="color:#6b7280;font-size:13px;margin:28px 0 0;">
      Questions? Contact us at <a href="mailto:contact@astraietm.in" style="color:#6366F1;text-decoration:none;">contact@astraietm.in</a>
    </p>
  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;padding:20px 30px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 ASTRA IETM · KMCT Institute of Emerging Technology and Management</p>
  </div>

</div>
</body>
</html>"""

        # ── 3. Build Resend payload ──────────────────────────────────────
        # Resend expects attachments as base64-encoded content strings
        clean_title = event.title.replace(' ', '_').replace('/', '-')
        filename = f"ASTRA_Ticket_{clean_title}_{registration.id}.png"
        ticket_b64 = base64.b64encode(ticket_png_bytes).decode('utf-8')

        payload = {
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [user.email],
            "subject": subject,
            "html": html_content,
            "text": strip_tags(html_content),
            "attachments": [
                {
                    "filename": filename,
                    "content": ticket_b64,
                }
            ],
        }

        logger.info(f"[EMAIL] Payload built, dispatching via Resend in background thread...")

        # ── 4. Send in background daemon thread ─────────────────────────
        thread = threading.Thread(target=_send_email_in_thread, args=(payload,), daemon=True)
        thread.start()

        return True

    except Exception as e:
        logger.error(f"[EMAIL] Failed to prepare email for registration #{registration.id}: {e}", exc_info=True)
        return False
