'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import { agentsAPI } from '@/lib/api';
import { AGENT_TEMPLATES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export default function NewAgentPage() {
  const router = useRouter();
  const { addToast } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || name.length < 3) { addToast('error', 'Agent name must be at least 3 characters'); return; }
    setLoading(true);
    try {
      const template = AGENT_TEMPLATES.find((t) => t.id === selectedTemplate);
      const res = await agentsAPI.create({
        name: name.trim(),
        description: description.trim(),
        workflow: template?.workflow,
      });
      addToast('success', `Agent "${name}" created!`);
      router.push(`/dashboard/agents/${res.data.data._id}/builder`);
    } catch {
      // Demo mode — simulate creation
      const fakeId = 'demo_' + Date.now();
      addToast('success', `Agent "${name}" created (demo)`);
      router.push(`/dashboard/agents/${fakeId}/builder`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Create New Agent</h2>
      <p style={{ color: 'var(--text-tertiary)', marginBottom: 32, fontSize: 14 }}>Choose a template and configure your agent&apos;s basic settings.</p>

      {/* Agent Info */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Agent Details</h3>
        <div className="form-group">
          <label className="label">Name</label>
          <input className="input" placeholder="e.g., Resume Classifier" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
        </div>
        <div className="form-group">
          <label className="label">Description (optional)</label>
          <textarea className="input textarea" placeholder="What does this agent do?" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
        </div>
      </div>

      {/* Templates */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Choose Template</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {AGENT_TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="card card-clickable"
              style={{
                borderColor: selectedTemplate === t.id ? 'var(--accent-purple)' : undefined,
                boxShadow: selectedTemplate === t.id ? '0 0 0 2px rgba(139,92,246,0.2)' : undefined,
              }}
              onClick={() => setSelectedTemplate(t.id)}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{t.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{t.description}</div>
              {selectedTemplate === t.id && (
                <div className="badge badge-purple" style={{ marginTop: 10 }}>Selected</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
        <button className="btn btn-primary btn-lg" onClick={handleCreate} disabled={loading || !name.trim()}>
          {loading ? <span className="spinner" /> : <>Create Agent <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}
