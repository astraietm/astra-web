# Hawkins Lab Payment Integration - Setup Guide

## Overview
Successfully integrated Razorpay payment gateway for Hawkins Lab event with ₹100 per team registration.

## What Was Implemented

### Backend (Django)

1. **Models** (`apps/api/events/models.py`):
   - Added `requires_payment` and `payment_amount` fields to `Event` model
   - Created `Payment` model to track Razorpay transactions with:
     - `razorpay_order_id`
     - `razorpay_payment_id`
     - `razorpay_signature`
     - `amount`, `currency`, `status`

2. **Views** (`apps/api/events/views.py`):
   - `CreatePaymentOrderView`: Creates Razorpay order for event registration
   - `VerifyPaymentView`: Verifies payment signature and updates registration status

3. **Serializers** (`apps/api/events/serializers.py`):
   - Added `PaymentSerializer`
   - Updated `RegistrationSerializer` to include payment details

4. **URLs** (`apps/api/events/urls.py`):
   - `/payment/create-order/` - Create Razorpay order
   - `/payment/verify/` - Verify payment

5. **Admin** (`apps/api/events/admin.py`):
   - Added `PaymentAdmin` for managing payments in Django admin

6. **Settings** (`apps/api/core/settings.py`):
   - Added Razorpay configuration:
     ```python
     RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
     RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
     ```

### Frontend (React)

1. **Payment Component** (`apps/web/src/components/payment/RazorpayPayment.jsx`):
   - Loads Razorpay SDK
   - Creates payment order
   - Handles payment flow
   - Verifies payment on backend

2. **Registration Modal** (`apps/web/src/components/events/HawkinsLabRegistrationModal.jsx`):
   - Team name input
   - Team members management (2-4 members)
   - Payment integration
   - QR code display after successful payment
   - Download ticket functionality

3. **Updated HawkinsLabDetail** (`apps/web/src/components/events/HawkinsLabDetail.jsx`):
   - Integrated registration modal
   - Shows ₹100 per team pricing
   - Authentication check before registration

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file (both local and production):

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_SSIQ6xSAP4EYAX
RAZORPAY_KEY_SECRET=0ngdUqSTUqIreIj6vRaBHg8N
```

**IMPORTANT**: 
- These are TEST keys from your screenshot
- For production, replace with LIVE keys from Razorpay dashboard
- Never commit these keys to Git

### 2. Database Migration

Already completed:
```bash
cd apps/api
python manage.py makemigrations
python manage.py migrate
```

### 3. Install Dependencies

Backend (already installed):
```bash
cd apps/api
pip install razorpay
```

### 4. Configure Hawkins Lab Event

In Django admin (`/admin/events/event/`):
1. Find or create "Hawkins Lab" event
2. Set these fields:
   - `requires_payment`: ✓ (checked)
   - `payment_amount`: 100.00
   - `is_team_event`: ✓ (checked)
   - `team_size_min`: 2
   - `team_size_max`: 4

### 5. Update Frontend Event ID

In `apps/web/src/components/events/HawkinsLabDetail.jsx`, line 19:
```javascript
const hawkinsLabEvent = {
  id: 1, // Replace with actual Hawkins Lab event ID from database
  title: 'Hawkins Lab',
  requires_payment: true,
  payment_amount: 100,
  is_team_event: true,
  team_size_min: 2,
  team_size_max: 4
};
```

**TODO**: Replace `id: 1` with the actual event ID from your database.

## Payment Flow

1. User clicks "Initiate Sequence" on Hawkins Lab detail page
2. If not logged in, shows login modal
3. If logged in, opens team registration modal
4. User enters:
   - Team name
   - 2-4 team member names
5. Clicks "Pay ₹100 & Register Team"
6. Razorpay payment modal opens
7. User completes payment
8. Backend verifies payment signature
9. Creates registration with QR code
10. Shows success screen with downloadable QR code

## Testing

### Test Payment Flow

1. Start backend: `cd apps/api && python manage.py runserver`
2. Start frontend: `cd apps/web && npm run dev`
3. Navigate to Hawkins Lab detail page
4. Click registration button
5. Fill team details
6. Use Razorpay test cards:
   - **Success**: 4111 1111 1111 1111
   - **Failure**: 4000 0000 0000 0002
   - CVV: Any 3 digits
   - Expiry: Any future date

### Verify in Admin

1. Go to `/admin/events/payment/`
2. Check payment status
3. Verify registration was created
4. Check QR code generation

## API Endpoints

### Create Payment Order
```
POST /payment/create-order/
Authorization: Bearer <JWT_TOKEN>

Request:
{
  "event_id": 1,
  "team_name": "Code Breakers",
  "team_members": "[\"Alice\", \"Bob\", \"Charlie\"]"
}

Response:
{
  "order_id": "order_xxx",
  "amount": 10000,  // in paise
  "currency": "INR",
  "key_id": "rzp_test_xxx",
  "registration_id": 123,
  "event_name": "Hawkins Lab"
}
```

### Verify Payment
```
POST /payment/verify/
Authorization: Bearer <JWT_TOKEN>

Request:
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}

Response:
{
  "success": true,
  "message": "Payment verified successfully!",
  "registration": {
    "id": 123,
    "qr_code": "data:image/png;base64,...",
    "team_name": "Code Breakers",
    "team_members": "[\"Alice\", \"Bob\", \"Charlie\"]",
    ...
  }
}
```

## Security Notes

1. **Signature Verification**: All payments are verified using HMAC SHA256 signature
2. **Authentication**: All payment endpoints require JWT authentication
3. **Idempotency**: Duplicate registrations are prevented
4. **Test vs Live**: Currently using TEST keys - switch to LIVE for production

## Production Checklist

- [ ] Replace TEST Razorpay keys with LIVE keys
- [ ] Update environment variables on Render
- [ ] Test payment flow in production
- [ ] Enable Razorpay webhooks for payment status updates
- [ ] Set up payment reconciliation
- [ ] Configure refund policy
- [ ] Add payment failure handling
- [ ] Set up monitoring for failed payments

## Troubleshooting

### Payment fails with "Failed to create payment order"
- Check Razorpay API keys are correct
- Verify backend can reach Razorpay API
- Check event `requires_payment` is True

### "Payment verification failed"
- Razorpay secret key might be incorrect
- Signature mismatch - check key configuration

### QR code not showing
- Check registration was created successfully
- Verify `generate_qr_code` utility is working
- Check serializer includes `qr_code` field

## Next Steps

1. **Get actual Hawkins Lab event ID** from database
2. **Update frontend** with correct event ID
3. **Test payment flow** with test cards
4. **Configure webhooks** for payment status updates
5. **Add email notifications** for successful payments
6. **Create refund workflow** if needed

## Files Modified

### Backend
- `apps/api/core/settings.py`
- `apps/api/events/models.py`
- `apps/api/events/views.py`
- `apps/api/events/serializers.py`
- `apps/api/events/urls.py`
- `apps/api/events/admin.py`

### Frontend
- `apps/web/src/components/events/HawkinsLabDetail.jsx`
- `apps/web/src/components/events/HawkinsLabRegistrationModal.jsx` (new)
- `apps/web/src/components/payment/RazorpayPayment.jsx` (new)

## Support

For Razorpay integration help:
- Documentation: https://razorpay.com/docs/
- Test cards: https://razorpay.com/docs/payments/payments/test-card-details/
- Dashboard: https://dashboard.razorpay.com/

---

**Status**: ✅ Integration Complete - Ready for Testing
**Payment Gateway**: Razorpay
**Amount**: ₹100 per team
**Event**: Hawkins Lab (Team Event, 2-4 members)
