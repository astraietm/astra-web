import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, currency = 'INR', receipt, notes } = body;

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'Amount is required.' },
        { status: 400 }
      );
    }

    const amountInPaise = Number(amount);
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Minimum order amount must be at least ₹1.00 (100 paise).' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay credentials are not configured on the server.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const orderOptions: any = {
      amount: Math.round(amountInPaise),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    if (notes && typeof notes === 'object') {
      orderOptions.notes = notes;
    }

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json(
      {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
        receipt: order.receipt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.statusCode === 401 || error.error?.code === 'BAD_REQUEST_ERROR' && error.error?.description?.includes('auth')) {
      return NextResponse.json(
        { error: error.error?.description || 'Razorpay authentication failed.' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: error.error?.description || error.message || 'Failed to create Razorpay order.' },
      { status: error.statusCode || 500 }
    );
  }
}
