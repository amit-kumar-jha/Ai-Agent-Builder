'use client';
import { CreditCard, Check, Shield } from 'lucide-react';

export default function BillingPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Billing & Usage</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage your subscription plan and payment methods.</p>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Pro Tier</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>You are currently on the Pro plan ($49/mo).</div>
        </div>
        <button className="btn btn-secondary">Manage Subscription</button>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Usage This Month</h3>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>API Credits</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>$142.50 / $250.00</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: '57%', height: '100%', background: 'var(--accent-purple)' }}></div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Your usage will reset on May 1st, 2026.</p>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Available Plans</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        {/* Free Plan */}
        <div style={{ padding: '32px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Developer</h4>
          <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>$0<span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-tertiary)' }}>/mo</span></div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Perfect for testing and side projects.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> 2 Agents</li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> 1,000 requests/mo</li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> Community Support</li>
          </ul>
          <button style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontWeight: 600 }}>Downgrade</button>
        </div>

        {/* Pro Plan */}
        <div style={{ padding: '32px 24px', background: 'var(--bg-secondary)', border: '2px solid var(--accent-purple)', borderRadius: '16px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-purple)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Pro</h4>
          <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>$49<span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-tertiary)' }}>/mo</span></div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For professional creators and small teams.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> Unlimited Agents</li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> 100,000 requests/mo</li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--accent-green)" /> Priority Email Support</li>
          </ul>
          <button style={{ width: '100%', padding: '10px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontWeight: 600 }}>Manage</button>
        </div>

        {/* Enterprise Plan */}
        <div style={{ padding: '32px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Enterprise</h4>
          <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Custom</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For large scale deployments.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--text-muted)" /> Custom Rate Limits</li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Check size={16} color="var(--text-muted)" /> SLA Guarantee</li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Shield size={16} color="var(--text-muted)" /> SOC2 Compliance</li>
          </ul>
          <button style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontWeight: 600 }}>Contact Sales</button>
        </div>

      </div>
    </div>
  );
}
