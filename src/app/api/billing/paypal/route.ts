import { NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { getCurrentUser } from '@/actions/auth';

const PLAN_PRICES: any = {
  pro: "49.00",
  enterprise: "499.00"
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('planId');
    const user = await getCurrentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!planId || !PLAN_PRICES[planId]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const order = await createPayPalOrder(planId, PLAN_PRICES[planId]);
    
    // Redirect to PayPal approve URL
    const approveUrl = order.links.find((link: any) => link.rel === 'approve');
    
    if (approveUrl) {
      return NextResponse.redirect(approveUrl.href);
    }

    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
