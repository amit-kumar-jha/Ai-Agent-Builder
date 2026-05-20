'use client';
import { useState, useEffect } from 'react';
import { Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { getUserCredits } from '@/actions/credits';

export default function CreditUsageBar({ collapsed }: { collapsed: boolean }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredits();
    // Refresh every 30 seconds
    const interval = setInterval(loadCredits, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCredits = async () => {
    try {
      const result = await getUserCredits();
      if (result.success) {
        setData(result.data);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data || collapsed) return null;

  const { totalAvailable, creditsUsed, planLimit, plan, percentUsed, bonusCredits } = data;

  // Color based on usage
  const getBarColor = () => {
    if (percentUsed >= 90) return '#EF4444'; // Red
    if (percentUsed >= 70) return '#F59E0B'; // Amber
    return '#8B5CF6'; // Purple
  };

  const barColor = getBarColor();

  return (
    <div style={{
      padding: '16px',
      borderTop: '1px solid var(--border-primary)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Zap size={14} color={barColor} />
          Credits
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {totalAvailable.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        borderRadius: '3px',
        background: 'var(--bg-input)',
        overflow: 'hidden',
        marginBottom: '8px',
      }}>
        <div style={{
          width: `${Math.min(percentUsed, 100)}%`,
          height: '100%',
          borderRadius: '3px',
          background: barColor,
          transition: 'width 0.5s ease, background 0.3s ease',
        }} />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px' }}>
        <span>{creditsUsed.toLocaleString()} used</span>
        <span>{planLimit.toLocaleString()} / mo</span>
      </div>

      {/* Bonus credits indicator */}
      {bonusCredits > 0 && (
        <div style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          +{bonusCredits.toLocaleString()} bonus credits
        </div>
      )}

      {/* Warning when low */}
      {percentUsed >= 80 && (
        <Link href="/dashboard/billing" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '8px 12px',
            background: percentUsed >= 90 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${percentUsed >= 90 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 600,
            color: percentUsed >= 90 ? 'var(--accent-red)' : 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <span>{percentUsed >= 90 ? 'Credits almost out!' : 'Credits running low'}</span>
            <ArrowUpRight size={12} />
          </div>
        </Link>
      )}

      {/* Upgrade CTA for free users */}
      {plan === 'free' && percentUsed < 80 && (
        <Link href="/dashboard/billing" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '8px 12px',
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <span>Upgrade for more</span>
            <ArrowUpRight size={12} />
          </div>
        </Link>
      )}
    </div>
  );
}
