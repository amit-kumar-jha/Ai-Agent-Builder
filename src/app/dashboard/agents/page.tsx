'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Plus, Search, Filter, MoreHorizontal, Activity, Loader2, ChevronRight, Trash2 } from 'lucide-react';
import { getMyAgents, createAgentAction, deleteAgentAction } from '@/actions/agent';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function AgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, agentId: string | null }>({ isOpen: false, agentId: null });
  const [limitModal, setLimitModal] = useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: '' });

  const loadData = async () => {
    setIsLoading(true);
    const res = await getMyAgents();
    if (res && res.data) {
      setAgents(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ isOpen: true, agentId: id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.agentId;
    if (!id) return;

    setIsDeleting(id);
    const res = await deleteAgentAction(id);
    if (res.success) {
      setAgents(agents.filter(a => a._id !== id));
      setDeleteModal({ isOpen: false, agentId: null });
    } else {
      alert(res.error || 'Failed to delete agent');
    }
    setIsDeleting(null);
  };

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

  const filteredAgents = agents.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>My Agents</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Create, manage, and monitor your AI agents.</p>
        </div>
        <button onClick={handleCreateAgent} disabled={isCreating} className="btn btn-primary" style={{ opacity: isCreating ? 0.7 : 1 }}>
          {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} New Agent
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
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

      <div className="table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
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
          <>
            {/* Desktop Table */}
            <table className="desktop-only" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link href={`/dashboard/agents/${agent._id}/builder`}>
                          <button style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }} title="Edit">
                            <MoreHorizontal size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={(e) => handleDeleteClick(e, agent._id)} 
                          disabled={isDeleting === agent._id}
                          style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', opacity: isDeleting === agent._id ? 0.5 : 1 }} 
                          title="Delete"
                        >
                          {isDeleting === agent._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile List */}
            <div className="mobile-only" style={{ display: 'none' }}>
              {filteredAgents.map((agent, i) => (
                <Link key={agent._id} href={`/dashboard/agents/${agent._id}/builder`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '20px', borderBottom: i === filteredAgents.length - 1 ? 'none' : '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(139, 92, 246, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'var(--accent-purple)' }}><Bot size={20} /></div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{agent.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`badge ${agent.status === 'active' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>{agent.status || 'Draft'}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{agent.model}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button 
                        onClick={(e) => handleDeleteClick(e, agent._id)}
                        style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-red)' }}
                      >
                        <Trash2 size={18} />
                      </button>
                      <ChevronRight size={18} color="var(--text-tertiary)" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        title="Delete Agent"
        message="Are you sure you want to delete this agent? This action cannot be undone and all data associated with this agent will be lost."
        confirmLabel="Delete Agent"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, agentId: null })}
        isLoading={!!isDeleting}
        type="danger"
      />
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
    </div>
  );
}
