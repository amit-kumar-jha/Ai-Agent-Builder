'use client';
import { BarChart2, Activity, Zap, CreditCard, Download } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Monitor API usage, token consumption, and agent performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '13px', outline: 'none', color: 'var(--text-primary)' }}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
          <button className="btn btn-secondary"><Download size={14} /> Export CSV</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <Activity size={16} /> Total Executions
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>12,485</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <Zap size={16} /> Avg. Latency
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>1.2s</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <CreditCard size={16} /> Total Cost
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>$142.50</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '32px', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
        <BarChart2 size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Detailed Charts Coming Soon</h3>
        <p style={{ fontSize: '14px', maxWidth: '400px', textAlign: 'center' }}>We are integrating Recharts to display your token usage and agent latency over time. Check back later.</p>
      </div>
    </div>
  );
}
