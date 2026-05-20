import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { CREDIT_PACKS } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { planId, packId, type } = body;

    await connectDB();
    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const customerId = dbUser.stripeCustomerId || undefined;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // ─── Credit Pack Purchase (one-time payment) ───
    if (type === 'credits' && packId) {
      const pack = CREDIT_PACKS.find(p => p.id === packId);
      if (!pack) {
        return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 });
      }

      try {
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          customer_email: customerId ? undefined : user.email,
          payment_method_types: ['card'],
          mode: 'payment', // One-time payment, not subscription
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `NexAgeAI ${pack.label}`,
                  description: `${pack.credits} bonus credits for your NexAgeAI account`,
                },
                unit_amount: pack.price,
              },
              quantity: 1,
            },
          ],
          metadata: {
            userId: user.id,
            type: 'credit_pack',
            packId: pack.id,
            credits: pack.credits.toString(),
          },
          success_url: `${baseUrl}/dashboard/billing?credits=success`,
          cancel_url: `${baseUrl}/dashboard/billing?credits=canceled`,
        });

        return NextResponse.json({ url: session.url });
      } catch (stripeError: any) {
        console.error('Stripe credit pack error:', stripeError);
        return NextResponse.json({ 
          error: `Stripe Error: ${stripeError.message}` 
        }, { status: 500 });
      }
    }

    // ─── Subscription Plan Checkout ───
    const priceId = STRIPE_PRICES[planId as keyof typeof STRIPE_PRICES];

    if (!priceId || priceId.includes('mock')) {
      return NextResponse.json({ 
        error: 'Payment gateway is in demo mode. Please configure your STRIPE_PRICE_PRO in .env.local to enable real checkouts.' 
      }, { status: 400 });
    }

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

