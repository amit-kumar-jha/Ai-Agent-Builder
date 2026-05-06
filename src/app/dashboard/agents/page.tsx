'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Plus, Search, Filter, MoreHorizontal, Activity, Loader2 } from 'lucide-react';
import { getMyAgents, createAgentAction } from '@/actions/agent';

export default function AgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function loadAgents() {
      const res = await getMyAgents();
      if (res && res.data) {
        setAgents(res.data);
      }
      setIsLoading(false);
    }
    loadAgents();
  }, []);

  const handleCreateAgent = async () => {
    setIsCreating(true);
    const res = await createAgentAction();
    if (res.success && res.agentId) {
      router.push(`/dashboard/agents/${res.agentId}/builder`);
    } else {
      alert(res.error || 'Failed to create agent');
      setIsCreating(false);
    }
  };

  const filteredAgents = agents.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>My Agents</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Create, manage, and monitor your AI agents.</p>
        </div>
        <button onClick={handleCreateAgent} disabled={isCreating} className="btn btn-primary" style={{ opacity: isCreating ? 0.7 : 1 }}>
          {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} New Agent
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            placeholder="Search agents..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <button style={{ padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '64px', display: 'flex', justifyContent: 'center' }}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-purple)" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Bot size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto' }} />
            <p>No agents found. Click "New Agent" to get started.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Active</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent, i) => (
                <tr key={agent._id} style={{ borderBottom: i === filteredAgents.length - 1 ? 'none' : '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `rgba(139, 92, 246, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'var(--accent-purple)' }}><Bot size={18} /></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{agent.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{agent.description || 'No description provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${agent.status === 'active' ? 'badge-green' : 'badge-amber'}`}>{agent.status || 'Draft'}</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {agent.model}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {new Date(agent.updatedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <Link href={`/dashboard/agents/${agent._id}/builder`}>
                      <button style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                        <MoreHorizontal size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
