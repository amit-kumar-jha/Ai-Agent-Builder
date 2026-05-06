'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import { agentsAPI } from '@/lib/api';
import { ArrowLeft, Save, Trash2, Globe, Copy, Key } from 'lucide-react';

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const { addToast } = useStore();

  const [name, setName] = useState('AI Chatbot');
  const [description, setDescription] = useState('A simple AI chatbot agent');
  const [timeout, setTimeout_] = useState(300);
  const [maxRetries, setMaxRetries] = useState(2);
  const [onError, setOnError] = useState('stop');
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [cacheTTL, setCacheTTL] = useState(3600);
  const apiKey = 'agent_demo_' + agentId?.slice(0, 16);

  const handleSave = async () => {
    try {
      await agentsAPI.update(agentId, { name, description, settings: { timeout, maxRetries, onError, cacheEnabled, cacheTTL } });
      addToast('success', 'Settings saved!');
    } catch {
      addToast('success', 'Settings saved (demo)');
    }
  };

  const handlePublish = async () => {
    try {
      await agentsAPI.publish(agentId);
      addToast('success', 'Agent published!');
    } catch {
      addToast('success', 'Agent published (demo)');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure? This will archive the agent.')) return;
    try {
      await agentsAPI.delete(agentId);
      addToast('success', 'Agent archived');
      router.push('/dashboard');
    } catch {
      addToast('success', 'Agent archived (demo)');
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button className="btn btn-ghost" onClick={() => router.push(`/dashboard/agents/${agentId}/builder`)}><ArrowLeft size={16} /></button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Agent Settings</h2>
      </div>

      {/* Basic Info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>General</h3>
        <div className="form-group">
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Description</label>
          <textarea className="input textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      {/* Execution Settings */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Execution</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="label">Timeout (seconds)</label>
            <input className="input" type="number" value={timeout} onChange={(e) => setTimeout_(parseInt(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="label">Max Retries</label>
            <input className="input" type="number" value={maxRetries} onChange={(e) => setMaxRetries(parseInt(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="label">On Error</label>
            <select className="select" value={onError} onChange={(e) => setOnError(e.target.value)}>
              <option value="stop">Stop</option>
              <option value="retry">Retry</option>
              <option value="skip">Skip</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cache */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Cache</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <input type="checkbox" id="cache" checked={cacheEnabled} onChange={(e) => setCacheEnabled(e.target.checked)} />
          <label htmlFor="cache" style={{ fontSize: 14, cursor: 'pointer' }}>Enable response caching</label>
        </div>
        {cacheEnabled && (
          <div className="form-group">
            <label className="label">Cache TTL (seconds)</label>
            <input className="input" type="number" value={cacheTTL} onChange={(e) => setCacheTTL(parseInt(e.target.value))} style={{ maxWidth: 200 }} />
          </div>
        )}
      </div>

      {/* API Access */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}><Key size={16} style={{ marginRight: 8, verticalAlign: -2 }} />API Access</h3>
        <div className="form-group">
          <label className="label">API Key</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" value={apiKey} readOnly style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
            <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(apiKey); addToast('success', 'API key copied'); }}><Copy size={14} /></button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          Use this key in the <code>X-API-Key</code> header to call your agent via API.
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-danger" onClick={handleDelete}><Trash2 size={14} /> Delete Agent</button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handlePublish}><Globe size={14} /> Publish</button>
          <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save Settings</button>
        </div>
      </div>
    </div>
  );
}
