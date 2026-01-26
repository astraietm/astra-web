# Quick Setup: Email Ticket Delivery

## ✅ What's Been Done

1. **Email sending enabled** in both registration flows:
   - Free event registrations
   - Paid event registrations (after payment verification)

2. **Professional email template created** with:
   - Modern gradient design
   - Embedded QR code
   - Event details (date, time, venue)
   - Team information (for team events)
   - Important instructions

3. **Background threading** implemented to prevent API blocking

---

## 🔧 What You Need to Do

### Step 1: Set Up Email Credentials

You need to add these environment variables to your **Render backend service**:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=ASTRA Events <noreply@astraietm.in>
```

### Step 2: Get Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Click "Select app" → Choose "Mail"
4. Click "Select device" → Choose "Other (Custom name)"
5. Type "ASTRA IETM Backend"
6. Click "Generate"
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
8. Use this as `EMAIL_HOST_PASSWORD`

### Step 3: Add to Render

1. Go to https://dashboard.render.com
2. Select your backend service (astra-backend)
3. Click **Environment** in the left sidebar
4. Click **Add Environment Variable**
5. Add each variable:
   - Key: `EMAIL_HOST_USER`
   - Value: `your-email@gmail.com`
   
   - Key: `EMAIL_HOST_PASSWORD`
   - Value: `your-app-password`
   
   - Key: `EMAIL_HOST`
   - Value: `smtp.gmail.com`
   
   - Key: `EMAIL_PORT`
   - Value: `587`
   
   - Key: `EMAIL_USE_TLS`
   - Value: `True`
   
   - Key: `DEFAULT_FROM_EMAIL`
   - Value: `ASTRA Events <noreply@astraietm.in>`

6. Click **Save Changes**
7. Render will automatically redeploy

---

## 🧪 Testing

After deployment:

1. Register for a **free event** on https://astraietm.in
2. Check your email inbox
3. You should receive a professional ticket email with QR code

If you don't receive the email:
- Check spam folder
- Verify environment variables are set correctly
- Check Render logs for errors

---

## 📧 Email Preview

Users will receive an email like this:

**Subject:** 🎟️ Your Ticket for [Event Name] - ASTRA IETM

**Content:**
- Personalized greeting
- Event confirmation message
- Event details (date, time, venue)
- QR code for entry
- Important instructions
- Link to view event details

---

## 🚀 Files Modified

1. `/apps/api/events/views.py` - Enabled email sending
2. `/apps/api/events/utils.py` - Enhanced email template
3. `/apps/web/src/pages/AdminEvents.jsx` - Fixed Loader2 import

---

## 📝 Next Steps

1. ✅ Code changes are complete
2. ⏳ Set up email credentials on Render (see Step 1-3 above)
3. ⏳ Test with a real registration
4. ⏳ Verify email delivery

---

**Need Help?** Check `EMAIL_TICKET_SETUP.md` for detailed documentation.
