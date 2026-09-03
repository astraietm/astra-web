# Solution: Use SendGrid for Email (Works on Render Free Plan)

## Problem
Render blocks outbound SMTP connections on ports 465 and 587.
This is common on free/starter plans to prevent spam.

## Solution: Use SendGrid

SendGrid has a free tier (100 emails/day) and works perfectly with Render.

---

## Setup Steps

### 1. Create SendGrid Account

1. Go to https://signup.sendgrid.com/
2. Sign up for free account
3. Verify your email
4. Complete the sender verification

### 2. Create API Key

1. Login to SendGrid
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it "ASTRA IETM"
5. Select **Full Access** or **Mail Send** permissions
6. Click **Create & View**
7. **Copy the API key** (you won't see it again!)

### 3. Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in:
   - From Name: `ASTRA Events`
   - From Email: `contact@astraietm.in`
   - Reply To: `contact@astraietm.in`
   - Company: `ASTRA IETM`
4. Submit and verify the email

### 4. Update Django Settings

Update `/home/cobra_sanjay/astra-web/apps/api/core/settings.py`:

```python
# Email Configuration - Using SendGrid
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'apikey'  # This is literally the string "apikey"
EMAIL_HOST_PASSWORD = os.environ.get('SENDGRID_API_KEY', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL2', 'ASTRA Events <contact@astraietm.in>')
```

### 5. Update Render Environment Variables

Go to Render Dashboard → Environment:

Remove or ignore:
- `EMAIL_HOST2`
- `EMAIL_HOST_USER2`

Add/Update:
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
SENDGRID_API_KEY=your-sendgrid-api-key-here
DEFAULT_FROM_EMAIL2=ASTRA Events <contact@astraietm.in>
```

### 6. Save and Redeploy

Render will auto-redeploy. Test registration again.

---

## Alternative: Use Gmail with App Password

If you want to stick with Gmail instead:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
DEFAULT_FROM_EMAIL=ASTRA Events <your-gmail@gmail.com>
```

**Note:** Gmail might also be blocked on Render free plan.

---

## Alternative 2: Upgrade Render Plan

If you upgrade to Render's paid plan ($7/month), SMTP ports are unblocked and Zoho will work.

---

## Recommended: SendGrid

✅ **Free tier**: 100 emails/day  
✅ **Works on Render free plan**  
✅ **Reliable delivery**  
✅ **Easy setup**  
✅ **Professional**  

This is the best solution for your use case!
