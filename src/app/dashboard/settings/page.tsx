'use client';
import { useState, useEffect } from 'react';
import { User, Shield, Key, Bell, Loader2, Copy, RefreshCw } from 'lucide-react';
import { getWorkspaceSettings, updateWorkspace, rollApiKey } from '@/actions/settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data
  const [workspaceName, setWorkspaceName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function loadData() {
      const res = await getWorkspaceSettings();
      if (res.success && res.data) {
        setWorkspaceName(res.data.workspaceName || 'Personal Workspace');
        setApiKey(res.data.apiKey || '');
        setEmail(res.data.email || '');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!workspaceName.trim()) return;
    setIsSaving(true);
    const res = await updateWorkspace({ workspaceName });
    setIsSaving(false);
    if (res.success) {
      alert('Workspace updated successfully!');
    } else {
      alert(res.error || 'Failed to update');
    }
  };

  const handleRollKey = async () => {
    const confirmed = confirm('Are you sure? Any live agents using this API key will stop working immediately.');
    if (!confirmed) return;
    
    setIsSaving(true);
    const res = await rollApiKey();
    setIsSaving(false);
    
    if (res.success) {
      setApiKey(res.apiKey);
      alert('API Key rolled successfully!');
    } else {
      alert(res.error || 'Failed to roll key');
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API Key copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
        <Loader2 className="animate-spin" color="var(--accent-purple)" size={32} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Workspace Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage your workspace preferences and API keys.</p>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Settings Navigation */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div 
            onClick={() => setActiveTab('general')}
            style={{ padding: '8px 12px', background: activeTab === 'general' ? 'var(--bg-input)' : 'transparent', borderRadius: '8px', fontSize: '14px', fontWeight: activeTab === 'general' ? 600 : 500, color: activeTab === 'general' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <User size={16} /> General
          </div>
          <div 
            onClick={() => setActiveTab('api')}
            style={{ padding: '8px 12px', background: activeTab === 'api' ? 'var(--bg-input)' : 'transparent', borderRadius: '8px', fontSize: '14px', fontWeight: activeTab === 'api' ? 600 : 500, color: activeTab === 'api' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Key size={16} /> API Keys
          </div>
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {activeTab === 'general' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Workspace Information</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Workspace Name</label>
                <input 
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none' }} 
                  className="focus-ring"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Owner Email</label>
                <input 
                  readOnly 
                  value={email} 
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-tertiary)', outline: 'none', cursor: 'not-allowed' }} 
                />
              </div>

              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="btn btn-primary"
                style={{ opacity: isSaving ? 0.7 : 1 }}
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'api' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Enterprise API Key</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                Use this API key to programmatically trigger your agents from external backends, CRMs, or custom clients. Do not share this key publicly.
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Secret Key</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    readOnly 
                    type="password"
                    value={apiKey} 
                    style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} 
                  />
                  <button onClick={handleCopyKey} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>

              <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Roll API Key</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Invalidate current key and generate a new one.</div>
                </div>
                <button 
                  onClick={handleRollKey} 
                  disabled={isSaving}
                  style={{ background: 'transparent', border: '1px solid var(--border-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: isSaving ? 'wait' : 'pointer', color: 'var(--text-primary)' }}
                >
                  <RefreshCw size={14} /> Roll Key
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
