'use client';
import { useState, useEffect } from 'react';
import { CreditCard, Check, Shield, Loader2 } from 'lucide-react';
import useStore from '@/lib/store';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function BillingPage() {
  const { user } = useStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean, title: string, message: string, type: 'danger' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title: string, message: string, type: 'danger' | 'info' | 'warning' = 'danger') => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      if (paymentMethod === 'stripe') {
        const res = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          showAlert('Payment Error', data.error || 'Failed to create Stripe session. Please check your credentials.', 'danger');
        }
      } else {
        showAlert('PayPal Initialization', 'Redirecting you to PayPal secure checkout...', 'info');
        setTimeout(() => {
          window.location.href = `/api/billing/paypal?planId=${planId}`;
        }, 1500);
      }
    } catch (error) {
      showAlert('Connection Error', 'Failed to reach payment gateway. Please try again later.', 'danger');
    } finally {
      setLoading(null);
    }
  };

  const handleEnterpriseClick = () => {
    showAlert('Enterprise Request', 'Our dedicated enterprise team has been notified. We will reach out to your registered email within 24 hours to schedule a custom demo.', 'info');
  };

  const isPro = user?.plan === 'pro';

  return (
    <>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="page-header" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Billing & Usage</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage your subscription plan and payment methods.</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'capitalize' }}>{user?.plan || 'Free'} Tier</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              You are currently on the {user?.plan || 'Free'} plan.
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Preferred Payment Method</div>
            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-primary)' }}>
              <button 
                onClick={() => setPaymentMethod('stripe')}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: paymentMethod === 'stripe' ? 'var(--bg-card)' : 'transparent', color: paymentMethod === 'stripe' ? 'var(--text-primary)' : 'var(--text-tertiary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: paymentMethod === 'stripe' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}
              >
                Stripe
              </button>
              <button 
                onClick={() => setPaymentMethod('paypal')}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: paymentMethod === 'paypal' ? 'var(--bg-card)' : 'transparent', color: paymentMethod === 'paypal' ? 'var(--text-primary)' : 'var(--text-tertiary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: paymentMethod === 'paypal' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}
              >
                PayPal
              </button>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Available Plans</h3>
        <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          
          <div style={{ padding: '32px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', opacity: isPro ? 0.6 : 1 }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Developer</h4>
            <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>$0<span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-tertiary)' }}>/mo</span></div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Perfect for testing and side projects.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> 3 Agents</li>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> 100 requests/mo</li>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> Community Support</li>
            </ul>
            <button disabled style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'not-allowed' }}>
              {user?.plan === 'free' || !user?.plan ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          <div style={{ padding: '32px 24px', background: isPro ? 'var(--bg-secondary)' : 'var(--bg-card)', border: isPro ? '2px solid var(--accent-purple)' : '1px solid var(--border-primary)', borderRadius: '16px', position: 'relative' }}>
            {isPro && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-purple)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</div>
            )}
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Pro</h4>
            <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>$49<span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-tertiary)' }}>/mo</span></div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For professional creators and small teams.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> Unlimited Agents</li>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> 10,000 requests/mo</li>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> Embeddable Widget</li>
            </ul>
            <button 
              onClick={() => handleSubscribe('pro')}
              disabled={isPro || loading === 'pro'}
              style={{ width: '100%', padding: '10px', background: isPro ? 'var(--bg-input)' : 'var(--text-primary)', color: isPro ? 'var(--text-secondary)' : 'var(--bg-primary)', border: isPro ? '1px solid var(--border-primary)' : 'none', borderRadius: '8px', fontWeight: 600, cursor: isPro ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              {loading === 'pro' && <Loader2 size={16} className="animate-spin" />}
              {isPro ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>

          <div style={{ padding: '32px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Enterprise</h4>
            <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Custom</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For large scale deployments.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--text-muted)" /> Custom Rate Limits</li>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--text-muted)" /> SLA Guarantee</li>
              <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Shield size={16} color="var(--text-muted)" /> SOC2 Compliance</li>
            </ul>
            <button 
              onClick={handleEnterpriseClick}
              style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              className="hover-bg-glass"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        confirmLabel="Got it"
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={() => setAlertModal({ ...alertModal, isOpen: false })}
        type={alertModal.type}
      />
    </>
  );
}
