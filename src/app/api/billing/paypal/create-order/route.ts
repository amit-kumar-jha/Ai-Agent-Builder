import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';
import { createPayPalOrder } from '@/lib/paypal';
import { CREDIT_PACKS, PLAN_CREDITS } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, packId, planId, agentId, price } = body;

    let amount = "0";
    let description = "";

    if (type === 'credits' && packId) {
      const pack = CREDIT_PACKS.find(p => p.id === packId);
      if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 });
      amount = (pack.price / 100).toFixed(2);
      description = `NexAgeAI ${pack.label} - ${pack.credits} Credits`;
    } else if (type === 'marketplace' && agentId && price) {
      amount = price.toFixed(2);
      description = `Marketplace Agent Purchase: ${agentId}`;
    } else if (type === 'plan' && planId) {
      // For simplicity, we'll treat plan upgrade as a one-time payment here or use fixed prices
      const planPrices: any = { 'starter': '29.00', 'pro': '79.00', 'enterprise': '299.00' };
      amount = planPrices[planId] || "0";
      description = `NexAgeAI ${planId} Plan Subscription`;
    }

    if (amount === "0") {
      return NextResponse.json({ error: 'Invalid purchase details' }, { status: 400 });
    }

    const order = await createPayPalOrder(description, amount);
    return NextResponse.json({ orderID: order.id });
  } catch (error: any) {
    console.error('PayPal create order error:', error);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
}
