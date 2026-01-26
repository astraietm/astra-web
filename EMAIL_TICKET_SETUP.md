# Email Ticket Delivery Setup Guide

## Overview
Automatic email delivery of event tickets with QR codes has been configured for ASTRA IETM.

## Features ✨

### 1. **Automatic Email Sending**
- ✅ Emails sent automatically after successful registration
- ✅ Works for both FREE and PAID events
- ✅ Background threading to avoid blocking the API

### 2. **Professional Email Template**
- 🎨 Modern, responsive HTML design
- 📱 Mobile-friendly layout
- 🎫 Embedded QR code for entry
- 📅 Formatted event details (date, time, venue)
- 🏆 Team information (for team events)
- ⚠️ Important instructions and notices

### 3. **Email Content Includes**
- Personalized greeting with user's name
- Event title, date, time, and venue
- Team name (if team event)
- QR code for entry verification
- Unique registration token
- Link to view event details
- Support contact information

---

## Configuration Required ⚙️

### Environment Variables

You need to set these in your `.env` file or hosting platform:

```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=ASTRA Events <noreply@astraietm.in>
```

### For Gmail Setup:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "ASTRA IETM"
   - Copy the 16-character password
   - Use this as `EMAIL_HOST_PASSWORD`

### For Production (Render):

1. Go to your Render Dashboard
2. Select your backend service
3. Navigate to **Environment** tab
4. Add the email environment variables
5. Click **Save Changes**

---

## Code Changes Made 🔧

### 1. **Backend Views** (`apps/api/events/views.py`)

#### Free Event Registration (Line 27-31):
```python
def perform_create(self, serializer):
    instance = serializer.save(user=self.request.user)
    # Send registration email with ticket
    send_registration_email(instance)
```

#### Paid Event Registration (Line 257-262):
```python
# Update registration status
registration = payment.registration
registration.status = 'REGISTERED'
registration.save()

# Send registration email with ticket
send_registration_email(registration)
```

### 2. **Email Utility** (`apps/api/events/utils.py`)

Enhanced email template with:
- Modern gradient header
- Responsive card-based layout
- Embedded QR code with styling
- Event details table
- Important notices section
- Call-to-action button
- Professional footer

---

## Email Flow 📧

```
┌─────────────────────────────────────────────────────────┐
│                   EMAIL DELIVERY FLOW                    │
└─────────────────────────────────────────────────────────┘

1. USER REGISTERS FOR EVENT
   │
   ├─→ Free Event: RegistrationCreateView.perform_create()
   └─→ Paid Event: VerifyPaymentView (after payment success)
   │
2. REGISTRATION SAVED TO DATABASE
   │
3. send_registration_email(registration) CALLED
   │
   ├─→ Generate QR code with registration token
   ├─→ Format email with event details
   ├─→ Attach QR code as inline image
   │
4. EMAIL SENT IN BACKGROUND THREAD
   │
5. USER RECEIVES TICKET EMAIL
   └─→ Email contains QR code for entry
```

---

## Testing Email Delivery 🧪

### Local Testing:

1. **Set up environment variables** in `apps/api/.env`
2. **Start the backend server**
3. **Register for an event** (free or paid)
4. **Check console logs** for email sending status
5. **Check your inbox** for the ticket email

### Console Output:
```
Starting email send to ['user@example.com']...
Email sent successfully to ['user@example.com']
```

### If Email Fails:
```
CRITICAL ERROR sending email: [Error details]
```

---

## Troubleshooting 🔍

### Email Not Sending?

1. **Check Environment Variables**
   ```bash
   # In Django shell
   python manage.py shell
   >>> from django.conf import settings
   >>> print(settings.EMAIL_HOST_USER)
   >>> print(settings.EMAIL_HOST)
   ```

2. **Test Email Configuration**
   ```python
   from django.core.mail import send_mail
   send_mail(
       'Test Subject',
       'Test message',
       settings.DEFAULT_FROM_EMAIL,
       ['recipient@example.com'],
       fail_silently=False,
   )
   ```

3. **Common Issues**:
   - ❌ Gmail blocking: Use App Password, not regular password
   - ❌ Port blocked: Try PORT=465 with EMAIL_USE_SSL=True
   - ❌ Firewall: Ensure outbound SMTP is allowed
   - ❌ Missing env vars: Check all EMAIL_* variables are set

---

## Email Template Preview 📱

The email includes:

```
┌─────────────────────────────────────────┐
│  ✨ Registration Confirmed!             │
│  Your ticket is ready                   │
├─────────────────────────────────────────┤
│                                         │
│  Hi [User Name],                        │
│                                         │
│  You're all set! Your registration for  │
│  [Event Name] has been confirmed.       │
│                                         │
│  🏆 Team Name: [Team] (if applicable)   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📅 Event Details               │   │
│  │  Date: Monday, January 27, 2026 │   │
│  │  Time: 10:00 AM                 │   │
│  │  Venue: Main Auditorium         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🎫 Your Entry Pass             │   │
│  │  Show this QR code at entrance  │   │
│  │                                 │   │
│  │      [QR CODE IMAGE]            │   │
│  │                                 │   │
│  │  Token: abc123...               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚠️ Important: Arrive 15 min early     │
│                                         │
│  [View Event Details] (Button)          │
│                                         │
└─────────────────────────────────────────┘
```

---

## Security Notes 🔒

- ✅ QR codes are unique per registration
- ✅ Tokens are cryptographically secure (32 bytes)
- ✅ Email sent via TLS/SSL encryption
- ✅ Background threading prevents API blocking
- ✅ No sensitive payment info in emails

---

## Next Steps 🚀

1. **Set up email credentials** in production environment
2. **Test with a real registration** (free event first)
3. **Verify email delivery** and formatting
4. **Monitor email logs** for any issues
5. **Update support email** if needed (currently: support@astraietm.in)

---

## Support

For issues or questions:
- Email: support@astraietm.in
- Check Django logs for email errors
- Verify SMTP settings in hosting platform

---

**Status**: ✅ Email delivery is now ACTIVE for all registrations!
