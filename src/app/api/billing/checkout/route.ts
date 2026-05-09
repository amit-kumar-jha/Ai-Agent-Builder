import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json(); // 'starter' or 'pro'
    const priceId = STRIPE_PRICES[planId as keyof typeof STRIPE_PRICES];

    if (!priceId || priceId.includes('mock')) {
      return NextResponse.json({ 
        error: 'Payment gateway is in demo mode. Please configure your STRIPE_PRICE_PRO in .env.local to enable real checkouts.' 
      }, { status: 400 });
    }

    await connectDB();
    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const customerId = dbUser.stripeCustomerId || undefined;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          planId: planId,
        },
        success_url: `${baseUrl}/dashboard/billing?success=true`,
        cancel_url: `${baseUrl}/dashboard/billing?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    } catch (stripeError: any) {
      console.error('Stripe SDK Error:', stripeError);
      return NextResponse.json({ 
        error: `Stripe Error: ${stripeError.message}. Check if your STRIPE_SECRET_KEY is valid.` 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
