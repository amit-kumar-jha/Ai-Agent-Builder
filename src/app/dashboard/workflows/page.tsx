'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GitMerge, Plus, Search, Filter, MoreHorizontal, Activity, Loader2 } from 'lucide-react';
import { getMyWorkflows, createWorkflowAction } from '@/actions/workflow';

export default function WorkflowsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await getMyWorkflows();
      if (res && res.data) {
        setWorkflows(res.data);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleCreate = async () => {
    setIsCreating(true);
    const res = await createWorkflowAction();
    if (res.success && res.workflowId) {
      router.push(`/dashboard/workflows/${res.workflowId}/builder`);
    } else {
      alert(res.error || 'Failed to create workflow');
      setIsCreating(false);
    }
  };

  const filteredWorkflows = workflows.filter(w => w.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Workflows</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Connect multiple agents to automate complex business processes.</p>
        </div>
        <button onClick={handleCreate} disabled={isCreating} className="btn btn-primary" style={{ opacity: isCreating ? 0.7 : 1 }}>
          {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} New Workflow
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            placeholder="Search workflows..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <button style={{ padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden', flex: workflows.length === 0 ? 1 : 'unset' }}>
        {isLoading ? (
          <div style={{ padding: '64px', display: 'flex', justifyContent: 'center' }}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-purple)" />
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px' }}>
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <GitMerge size={32} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>No workflows yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Workflows allow you to orchestrate multiple AI agents in sequence or in parallel. Combine them with logic nodes to build powerful automation.
              </p>
              <button onClick={handleCreate} disabled={isCreating} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {isCreating ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Create your first Workflow</>}
              </button>
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workflow</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Edited</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkflows.map((workflow, i) => (
                <tr key={workflow._id} style={{ borderBottom: i === filteredWorkflows.length - 1 ? 'none' : '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `rgba(139, 92, 246, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'var(--accent-purple)' }}>
                        <GitMerge size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{workflow.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{workflow.description || 'No description provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${workflow.status === 'active' ? 'badge-green' : 'badge-amber'}`}>{workflow.status || 'Draft'}</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {new Date(workflow.updatedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <Link href={`/dashboard/workflows/${workflow._id}/builder`}>
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
