# Email Debugging Checklist

## Quick Checks

### 1. Verify Environment Variables on Render

Go to Render Dashboard → Backend Service → Environment

Check these are set:
```
EMAIL_HOST2=smtp.zoho.com
EMAIL_HOST_USER2=contact@astraietm.in
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL2=ASTRA Events <contact@astraietm.in>
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

### 2. Check Render Logs

1. Go to Render Dashboard
2. Click on your backend service
3. Click "Logs" tab
4. Look for:
   - "Starting email send to..."
   - "Email sent successfully..."
   - OR any error messages with "email" or "SMTP"

### 3. Common Issues

**Issue: No logs at all**
- Email function might not be triggered
- Check if registration was successful
- Verify the code changes were deployed

**Issue: "Authentication failed"**
- Wrong app password
- Wrong email address
- Try regenerating Zoho app password

**Issue: "Connection refused" or "Connection timeout"**
- Wrong port (try 465 with SSL instead)
- Firewall blocking SMTP
- Try alternative Zoho settings below

**Issue: "Relay access denied"**
- EMAIL_HOST_USER2 doesn't match the Zoho account

### 4. Alternative Zoho Settings

If port 587 doesn't work, try SSL on port 465:

```
EMAIL_HOST2=smtp.zoho.com
EMAIL_PORT=465
EMAIL_USE_TLS=False
EMAIL_USE_SSL=True
EMAIL_HOST_USER2=contact@astraietm.in
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL2=ASTRA Events <contact@astraietm.in>
```

### 5. Test Email Manually

SSH into Render or use Django shell:

```python
from django.core.mail import send_mail
from django.conf import settings

# Check settings
print("EMAIL_HOST:", settings.EMAIL_HOST)
print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
print("EMAIL_PORT:", settings.EMAIL_PORT)
print("EMAIL_USE_TLS:", settings.EMAIL_USE_TLS)

# Send test email
send_mail(
    'Test from ASTRA',
    'This is a test email.',
    settings.DEFAULT_FROM_EMAIL,
    ['your-email@example.com'],
    fail_silently=False,
)
```

### 6. Check Zoho Settings

In Zoho Mail account:
- ✅ SMTP is enabled
- ✅ App password is active
- ✅ No security blocks on SMTP access
- ✅ Account is verified

### 7. Verify Code Deployment

Check if latest code is deployed:
- Go to Render Dashboard
- Check "Last Deploy" timestamp
- Should be recent (after you saved env variables)
- If not, manually trigger redeploy

### 8. Check Registration Flow

Verify registration actually completed:
- Check Django admin for new registration
- Check if status is "REGISTERED"
- Check if QR code was generated

### 9. Email Sending Code Location

The email is sent from:
- `apps/api/events/views.py` line 30 (free events)
- `apps/api/events/views.py` line 261 (paid events)
- Function: `send_registration_email()` in `apps/api/events/utils.py`

### 10. Quick Fix Checklist

- [ ] Environment variables set on Render
- [ ] Render service redeployed after env changes
- [ ] App password is correct (no spaces)
- [ ] Email is contact@astraietm.in
- [ ] Registration completed successfully
- [ ] Check Render logs for errors
- [ ] Check spam folder
- [ ] Try alternative port (465)

---

## Most Likely Issues

1. **Render not redeployed** after adding env variables
2. **Wrong app password** (spaces, typos)
3. **Port blocked** - try 465 instead of 587
4. **Email function not triggered** - check registration status

---

## Next Steps

1. Check Render logs first
2. Verify env variables are set
3. Try manual redeploy
4. Test with alternative port if needed
