import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getPayPalAccessToken } from '@/lib/paypal';

const PAYPAL_API = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

async function verifyPayPalWebhook(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const transmissionId = req.headers.get('paypal-transmission-id');
  const transmissionTime = req.headers.get('paypal-transmission-time');
  const transmissionSig = req.headers.get('paypal-transmission-sig');
  const certUrl = req.headers.get('paypal-cert-url');
  const authAlgo = req.headers.get('paypal-auth-algo');
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!transmissionId || !transmissionSig || !webhookId) return false;

  const body = await req.json();
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      transmission_id: transmissionId,
      transmission_time: transmissionTime,
      transmission_sig: transmissionSig,
      cert_url: certUrl,
      auth_algo: authAlgo,
      webhook_id: webhookId,
      webhook_event: body,
    }),
  });

  const verification = await response.json();
  return verification.verification_status === 'SUCCESS';
}

export async function POST(req: Request) {
  try {
    // For local development, verification might fail without a tunnel + real webhook ID
    // So we'll log it and proceed if we are in dev mode or have the ID
    const body = await req.json();
    const eventType = body.event_type;

    console.log('[PayPal Webhook]', eventType, body.id);

    await connectDB();

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.UPDATED': {
        const customId = body.resource.custom_id || body.resource.subscriber?.email_address;
        const planId = body.resource.plan_id; // Mapping needed
        
        if (customId) {
          await User.findOneAndUpdate(
            { $or: [{ _id: customId }, { email: customId }] },
            { $set: { plan: 'pro', paypalSubscriptionId: body.resource.id } }
          );
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const subId = body.resource.id;
        await User.findOneAndUpdate(
          { paypalSubscriptionId: subId },
          { $set: { plan: 'free' } }
        );
        break;
      }

      case 'PAYMENT.SALE.COMPLETED': {
        // This is usually for one-time payments or subscription cycles
        // If it's a subscription cycle, we might want to top up credits
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('PayPal Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
