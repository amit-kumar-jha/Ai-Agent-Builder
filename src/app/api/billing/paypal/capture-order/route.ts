import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';
import { capturePayPalOrder } from '@/lib/paypal';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Agent from '@/models/AgentModel';
import { CREDIT_PACKS } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderID, type, packId, planId, agentId } = await req.json();
    if (!orderID) return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });

    const captureData = await capturePayPalOrder(orderID);
    
    if (captureData.status === 'COMPLETED') {
      await connectDB();
      const dbUser = await User.findById(user.id);
      if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      // ─── Handle Credit Pack Purchase ───
      if (type === 'credits' && packId) {
        const pack = CREDIT_PACKS.find(p => p.id === packId);
        if (pack) {
          dbUser.bonusCredits = (dbUser.bonusCredits || 0) + pack.credits;
          dbUser.creditPurchases.push({
            amount: pack.credits,
            price: pack.price,
            stripePaymentId: orderID, // Reusing field for PayPal Order ID
            purchasedAt: new Date()
          });
          await dbUser.save();
          return NextResponse.json({ success: true, message: 'Credits added successfully' });
        }
      }

      // ─── Handle Plan Upgrade ───
      if (type === 'plan' && planId) {
        dbUser.plan = planId;
        // Reset credits based on plan? Or just update plan status.
        await dbUser.save();
        return NextResponse.json({ success: true, message: `Plan upgraded to ${planId}` });
      }

      // ─── Handle Marketplace Purchase ───
      if (type === 'marketplace' && agentId) {
        const sourceAgent = await Agent.findById(agentId);
        if (sourceAgent) {
          const newAgentData = sourceAgent.toObject();
          delete newAgentData._id;
          newAgentData.userId = user.id;
          newAgentData.user = user.id;
          newAgentData.public = false;
          newAgentData.status = 'draft';
          newAgentData.name = `${newAgentData.name} (Copy)`;
          
          await Agent.create(newAgentData);

          // ─── Revenue Share Logic (80% to creator, 20% to platform) ───
          if (sourceAgent.marketplacePrice > 0) {
            const creatorId = sourceAgent.userId || sourceAgent.user;
            if (creatorId) {
              const earnings = sourceAgent.marketplacePrice * 0.8;
              await User.findByIdAndUpdate(creatorId, {
                $inc: { totalEarnings: earnings }
              });
            }
          }
          return NextResponse.json({ success: true, message: 'Agent purchased and added to your workspace' });
        }
      }
    }

    return NextResponse.json({ success: false, error: 'Payment not completed' });
  } catch (error: any) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: 'Failed to capture payment' }, { status: 500 });
  }
}
