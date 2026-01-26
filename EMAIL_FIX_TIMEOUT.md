# Fix for Connection Timeout Error

## Problem
`CRITICAL ERROR sending email: [Errno 110] Connection timed out`

This means port 587 is blocked or timing out.

## Solution: Use Port 465 with SSL

Update your Render environment variables:

### Change These Variables:

| Variable | Old Value | New Value |
|----------|-----------|-----------|
| `EMAIL_PORT` | `587` | `465` |
| `EMAIL_USE_TLS` | `True` | `False` |
| `EMAIL_USE_SSL` | `False` | `True` |

### Keep These the Same:

```
EMAIL_HOST2=smtp.zoho.com
EMAIL_HOST_USER2=contact@astraietm.in
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL2=ASTRA Events <contact@astraietm.in>
```

## Steps to Fix:

1. Go to Render Dashboard
2. Click on your backend service
3. Go to **Environment** tab
4. Update these 3 variables:
   - `EMAIL_PORT` → Change to `465`
   - `EMAIL_USE_TLS` → Change to `False`
   - `EMAIL_USE_SSL` → Change to `True`
5. Click **Save Changes**
6. Render will auto-redeploy
7. Test registration again

## Why This Happens

- Port 587 (TLS/STARTTLS) is sometimes blocked by cloud providers
- Port 465 (SSL) is more reliable for cloud deployments
- Both are valid SMTP ports, just different encryption methods

## After Changing

You should see in logs:
```
[EMAIL] Starting email generation...
[EMAIL] QR code generated successfully
[EMAIL] Creating email message...
Starting email send to ['user@example.com']...
Email sent successfully to ['user@example.com']
```

No more connection timeout! ✅
