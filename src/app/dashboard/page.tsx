'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import { getMyAgents, getDashboardStats, createAgentAction } from '@/actions/agent';
import { STATUS_COLORS } from '@/lib/constants';
import { Plus, Activity, DollarSign, Zap, TrendingUp, Bot, FileText, LayoutTemplate, Loader2, CheckCircle, XCircle } from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useStore();
  const [agents, setAgents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [limitModal, setLimitModal] = useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: '' });

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAgent = async () => {
    setIsCreating(true);
    const res = await createAgentAction();
    if (res.success && res.agentId) {
      router.push(`/dashboard/agents/${res.agentId}/builder`);
    } else if (res.error === 'LIMIT_REACHED') {
      setLimitModal({ isOpen: true, message: res.message || 'You have reached your plan limit.' });
      setIsCreating(false);
    } else {
      alert(res.error || 'Failed to create agent');
      setIsCreating(false);
    }
  };

  const loadData = async () => {
    try {
      const [agentsRes, statsRes] = await Promise.all([
        getMyAgents(),
        getDashboardStats(),
      ]);

      if (agentsRes.data) setAgents(agentsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch {
      // Silently handle errors
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '120px 20px' }}>
        <Loader2 className="animate-spin" size={32} color="var(--accent-purple)" />
      </div>
    );
  }

  const s = stats || { totalAgents: 0, publishedCount: 0, draftCount: 0, totalExecutions: 0, totalCost: 0, successRate: 0 };

  return (
    <>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Welcome back, {user?.name || 'User'}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Here's what's happening with your agents.</p>
      </div>

      {/* Overview Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Agents</span>
            <Bot size={16} color="var(--text-tertiary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{s.totalAgents}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--accent-green)' }}>{s.publishedCount} published</span> · {s.draftCount} draft
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Executions</span>
            <Zap size={16} color="var(--text-tertiary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{s.totalExecutions.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {s.totalExecutions > 0 ? (
              <>
                <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}><CheckCircle size={12} /> {s.successRate}%</span> success rate
              </>
            ) : 'No runs yet'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Success / Errors</span>
            <Activity size={16} color="var(--text-tertiary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ color: 'var(--accent-green)' }}>{s.totalSuccesses || 0}</span>
            <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '18px', color: 'var(--accent-red)' }}>{s.totalErrors || 0}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {s.totalErrors > 0 ? (
              <span style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={12} /> {s.totalErrors} errors need attention</span>
            ) : (
              <span style={{ color: 'var(--accent-green)' }}>All systems healthy</span>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Spend (Total)</span>
            <DollarSign size={16} color="var(--text-tertiary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>${s.totalCost.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {s.totalCost > 0 ? 'Across all agents' : 'Using free models — $0 cost'}
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

        {/* Recent Agents */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Your Agents</h3>
            <Link href="/dashboard/agents" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>View All</Link>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
            {agents.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <Bot size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>No agents yet. Create your first one!</p>
                <button onClick={handleCreateAgent} disabled={isCreating} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Create Agent
                </button>

              </div>
            ) : (
              agents.slice(0, 5).map((agent, i) => (
                <div key={agent._id} style={{ padding: '16px 20px', borderBottom: i !== Math.min(agents.length, 5) - 1 ? '1px solid var(--border-primary)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${agent.color || '#8B5CF6'}15`, color: agent.color || '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {agent.icon || '🤖'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{agent.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        {agent.stats?.totalExecutions ? `${agent.stats.totalExecutions} runs` : 'No runs yet'} ·
                        {agent.model || 'llama3.2'} ·
                        {agent.updatedAt ? ` Updated ${new Date(agent.updatedAt).toLocaleDateString()}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`badge badge-${STATUS_COLORS[agent.status] || 'gray'}`}>{agent.status || 'draft'}</span>
                    <Link href={`/dashboard/agents/${agent._id}/builder`}>
                      <button style={{ padding: '6px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>Edit</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <button onClick={handleCreateAgent} disabled={isCreating} style={{ background: 'transparent', border: 'none', padding: 0, width: '100%', textAlign: 'left' }}>
              <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', color: 'var(--accent-purple)' }}>{isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Create Agent</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Start from scratch</div>
                </div>
              </div>
            </button>

            <Link href="/dashboard/marketplace" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', color: 'var(--accent-cyan)' }}><LayoutTemplate size={18} /></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Use Template</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Browse marketplace</div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/analytics" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--accent-green)' }}><Activity size={18} /></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>View Analytics</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Monitor performance</div>
                </div>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
    <ConfirmationModal 
      isOpen={limitModal.isOpen}
      title="Plan Limit Reached"
      message={limitModal.message + " Please upgrade your plan to create more agents."}
      confirmLabel="Upgrade Now"
      cancelLabel="Maybe Later"
      onConfirm={() => router.push('/dashboard/billing')}
      onCancel={() => setLimitModal({ isOpen: false, message: '' })}
      type="warning"
    />
    </>
  );
}
