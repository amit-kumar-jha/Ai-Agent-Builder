'use client';
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Wallet, Bot, ExternalLink, Loader2, Copy, Info } from 'lucide-react';
import { getCreatorEarnings } from '@/actions/earnings';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function EarningsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'danger' | 'info' | 'warning' }>({
    isOpen: false, title: '', message: '', type: 'info',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getCreatorEarnings();
    if (res.success) setData(res.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '120px' }}>
        <Loader2 className="animate-spin" size={32} color="var(--accent-purple)" />
      </div>
    );
  }

  const platformFee = (data?.totalEarnings || 0) * 0.25; // 20% platform fee (earnings is already 80%)
  const pendingPayout = data?.totalEarnings || 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Creator Earnings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Track your marketplace revenue and manage payouts.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <DollarSign size={16} /> Total Earnings
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-green)' }}>${(data?.totalEarnings || 0).toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Lifetime revenue (80% share)</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <Wallet size={16} /> Pending Payout
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>${pendingPayout.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Available for withdrawal</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <TrendingUp size={16} /> Marketplace Agents
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{data?.agents?.length || 0}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Published and priced</div>
        </div>
      </div>

      {/* Payout Configuration */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Payout Method</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Revenue is paid via PayPal. Configure your email in Settings → API Keys.</p>
          </div>
          {data?.paypalPayoutEmail && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-green)' }}>PayPal Connected</span>
            </div>
          )}
        </div>

        {data?.paypalPayoutEmail ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: 'var(--accent-blue)' }}>
              <Wallet size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{data.paypalPayoutEmail}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>PayPal payout email</div>
            </div>
            <button 
              onClick={() => {
                setAlertModal({
                  isOpen: true,
                  title: 'Request Payout',
                  message: pendingPayout > 0 
                    ? `Your payout of $${pendingPayout.toFixed(2)} will be sent to ${data.paypalPayoutEmail} within 3-5 business days. Minimum payout is $10.`
                    : 'You have no pending earnings to withdraw.',
                  type: pendingPayout > 0 ? 'info' : 'warning',
                });
              }}
              disabled={pendingPayout < 10}
              style={{ padding: '10px 20px', background: pendingPayout >= 10 ? 'var(--accent-green)' : 'var(--bg-input)', color: pendingPayout >= 10 ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: pendingPayout >= 10 ? 'pointer' : 'default', opacity: pendingPayout >= 10 ? 1 : 0.5 }}
            >
              Request Payout
            </button>
          </div>
        ) : (
          <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Info size={18} color="var(--accent-amber)" />
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              No PayPal email configured. Go to <strong>Settings → API Keys</strong> to add your payout email.
            </div>
          </div>
        )}
      </div>

      {/* Agent Earnings Breakdown */}
      {data?.agents && data.agents.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Revenue by Agent</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Agent</th>
                <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Your Share (80%)</th>
                <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Listed</th>
              </tr>
            </thead>
            <tbody>
              {data.agents.map((agent: any) => (
                <tr key={agent.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{agent.icon || '🤖'}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{agent.name}</span>
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontSize: '14px', color: 'var(--text-secondary)' }}>${agent.price}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: 'var(--accent-green)' }}>${(agent.price * 0.8).toFixed(2)}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'right', fontSize: '12px', color: 'var(--text-tertiary)' }}>{new Date(agent.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {(!data?.agents || data.agents.length === 0) && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Bot size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No marketplace agents yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            Publish an agent to the marketplace with a price to start earning revenue. You'll receive 80% of every sale.
          </p>
        </div>
      )}

      <ConfirmationModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        confirmLabel="Got it"
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={() => setAlertModal({ ...alertModal, isOpen: false })}
        type={alertModal.type}
      />
    </div>
  );
}
