import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment details (razorpay_order_id, razorpay_payment_id, and razorpay_signature).' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Razorpay secret key is not configured on the server.' },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf-8'),
      Buffer.from(razorpay_signature, 'utf-8')
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Payment verification failed: signature mismatch.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully!',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
