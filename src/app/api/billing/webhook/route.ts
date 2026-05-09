import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const subscription: any = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (userId) {
      await connectDB();
      await User.findByIdAndUpdate(userId, {
        plan: planId || 'pro',
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      });
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription: any = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await connectDB();
    await User.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      }
    );
  }

  return new NextResponse('Webhook received', { status: 200 });
}
