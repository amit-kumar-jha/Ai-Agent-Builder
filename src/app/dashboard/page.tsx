'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useStore from '@/lib/store';
import { agentsAPI } from '@/lib/api';
import { STATUS_COLORS } from '@/lib/constants';
import { Plus, Activity, DollarSign, Zap, TrendingUp, Bot, FileText, Settings, Play, LayoutTemplate } from 'lucide-react';

export default function DashboardPage() {
  const { agents, setAgents, user, addToast } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const res = await agentsAPI.list();
      setAgents(res.data.data || []);
    } catch {
      // Mock data for overview
      setAgents([
        {
          _id: '1', name: 'Resume Classifier', description: 'Classifies resumes into job levels with AI-powered scoring', status: 'published', icon: '📋', color: '#8B5CF6',
          tags: ['hr', 'classifier'], version: '0.2.0',
          stats: { totalExecutions: 1485, successCount: 1470, errorCount: 15, avgLatency: 3200, costToDate: 4.50, lastExecutedAt: new Date().toISOString() },
        },
        {
          _id: '2', name: 'Customer Support Bot', description: 'AI-powered customer support agent with multi-step reasoning', status: 'draft', icon: '💬', color: '#06B6D4',
          tags: ['support', 'chatbot'], version: '0.1.0',
          stats: { totalExecutions: 42, successCount: 40, errorCount: 2, avgLatency: 2100, costToDate: 0.85, lastExecutedAt: new Date().toISOString() },
        },
      ] as any[]);
    } finally {
      setLoading(false);
    }
  };

  const totalExecutions = 1527; // Mocked aggregate
  const activeWorkflows = 3;
  const totalCost = 5.35;
  const avgSuccess = 98.2;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Welcome back, {user?.name || 'User'}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Here is what's happening with your agents today.</p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Agents</span>
            <Bot size={16} color="var(--text-tertiary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{agents.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}><TrendingUp size={12} /> +1</span> since last week
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Workflows</span>
            <Activity size={16} color="var(--text-tertiary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{activeWorkflows}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}><TrendingUp size={12} /> +12%</span> volume
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>API Usage</span>
            <Zap size={16} color="var(--text-tertiary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{totalExecutions}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center' }}>{avgSuccess}%</span> success rate
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Spend (MTD)</span>
            <DollarSign size={16} color="var(--text-tertiary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>${totalCost.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>$20.00 credit remaining</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Agents */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Agents</h3>
            <Link href="/dashboard/agents" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>View All</Link>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
            {agents.map((agent, i) => (
              <div key={agent._id} style={{ padding: '16px 20px', borderBottom: i !== agents.length - 1 ? '1px solid var(--border-primary)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${agent.color}15`, color: agent.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    {agent.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{agent.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{agent.stats.totalExecutions} runs · Last updated 2 hrs ago</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge badge-${STATUS_COLORS[agent.status]}`}>{agent.status}</span>
                  <Link href={`/dashboard/agents/${agent._id}/builder`}>
                    <button style={{ padding: '6px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <Link href="/dashboard/agents/new" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', color: 'var(--accent-purple)' }}><Plus size={18} /></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Create Agent</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Start from scratch</div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/marketplace" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', color: 'var(--accent-cyan)' }}><LayoutTemplate size={18} /></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Use Template</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Browse marketplace</div>
                </div>
              </div>
            </Link>

            <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--accent-green)' }}><FileText size={18} /></div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Import Knowledge</div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Upload PDFs or Docs</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
