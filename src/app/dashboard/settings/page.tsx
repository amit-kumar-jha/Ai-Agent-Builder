'use client';
import { useState, useEffect } from 'react';
import { User, Shield, Key, Bell, Loader2, Copy, RefreshCw, Building, Users, Globe, Lock, Code, Webhook, Plus, Trash2, MoreVertical } from 'lucide-react';
import { getWorkspaceSettings, updateWorkspace, rollApiKey } from '@/actions/settings';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean, title: string, message: string, type: 'danger' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  
  // Data
  const [workspaceName, setWorkspaceName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');
  
  // Enterprise Data
  const [orgName, setOrgName] = useState('NexAgeAI Enterprise');
  const [website, setWebsite] = useState('https://nexageai.com');
  const [timezone, setTimezone] = useState('UTC');
  const [twoFactor, setTwoFactor] = useState(false);
  const [members, setMembers] = useState([
    { id: '1', name: 'Admin User', email: 'admin@nexageai.com', role: 'Owner' },
    { id: '2', name: 'Dev Team', email: 'dev@nexageai.com', role: 'Developer' }
  ]);
  const [webhooks, setWebhooks] = useState([
    { id: '1', url: 'https://api.nexageai.com/v1/webhooks/github', event: 'agent_executed' }
  ]);

  const showAlert = (title: string, message: string, type: 'danger' | 'info' | 'warning' = 'info') => {
    setAlertModal({ isOpen: true, title, message, type });
  };

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
        {/* Settings Navigation */}
        <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', padding: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal</div>
          <div 
            onClick={() => setActiveTab('general')}
            style={{ padding: '10px 12px', background: activeTab === 'general' ? 'var(--bg-input)' : 'transparent', borderRadius: '10px', fontSize: '13px', fontWeight: activeTab === 'general' ? 600 : 500, color: activeTab === 'general' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <User size={16} /> Profile
          </div>
          
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', padding: '12px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '12px' }}>Enterprise</div>
          <div 
            onClick={() => setActiveTab('organization')}
            style={{ padding: '10px 12px', background: activeTab === 'organization' ? 'var(--bg-input)' : 'transparent', borderRadius: '10px', fontSize: '13px', fontWeight: activeTab === 'organization' ? 600 : 500, color: activeTab === 'organization' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Building size={16} /> Organization
          </div>
          <div 
            onClick={() => setActiveTab('team')}
            style={{ padding: '10px 12px', background: activeTab === 'team' ? 'var(--bg-input)' : 'transparent', borderRadius: '10px', fontSize: '13px', fontWeight: activeTab === 'team' ? 600 : 500, color: activeTab === 'team' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Users size={16} /> Team Management
          </div>
          <div 
            onClick={() => setActiveTab('security')}
            style={{ padding: '10px 12px', background: activeTab === 'security' ? 'var(--bg-input)' : 'transparent', borderRadius: '10px', fontSize: '13px', fontWeight: activeTab === 'security' ? 600 : 500, color: activeTab === 'security' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Shield size={16} /> Security & SSO
          </div>

          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', padding: '12px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '12px' }}>Developer</div>
          <div 
            onClick={() => setActiveTab('api')}
            style={{ padding: '10px 12px', background: activeTab === 'api' ? 'var(--bg-input)' : 'transparent', borderRadius: '10px', fontSize: '13px', fontWeight: activeTab === 'api' ? 600 : 500, color: activeTab === 'api' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Key size={16} /> API Keys
          </div>
          <div 
            onClick={() => setActiveTab('webhooks')}
            style={{ padding: '10px 12px', background: activeTab === 'webhooks' ? 'var(--bg-input)' : 'transparent', borderRadius: '10px', fontSize: '13px', fontWeight: activeTab === 'webhooks' ? 600 : 500, color: activeTab === 'webhooks' ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Webhook size={16} /> Webhooks
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

          {activeTab === 'organization' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Organization Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Organization Name</label>
                    <input value={orgName} onChange={(e) => setOrgName(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Website URL</label>
                    <input value={website} onChange={(e) => setWebsite(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Primary Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="UTC">UTC (Universal Time Coordinated)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                  </select>
                </div>
              </div>
              <button onClick={() => showAlert('Organization Updated', 'Your enterprise organization details have been saved.', 'info')} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Update Organization</button>
            </div>
          )}

          {activeTab === 'team' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Team Members</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Manage user access and enterprise roles.</p>
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => showAlert('Enterprise Feature', 'User invitations are part of the IAM module. Please contact support to enable more seats.', 'warning')}>
                  <Plus size={16} /> Invite Member
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>Member</th>
                    <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>Role</th>
                    <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{member.email}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className="badge badge-purple" style={{ fontSize: '10px' }}>{member.role}</span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Two-Factor Authentication</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Secure your account with an additional layer of security.</p>
                  </div>
                  <div 
                    onClick={() => setTwoFactor(!twoFactor)}
                    style={{ width: '44px', height: '24px', background: twoFactor ? 'var(--accent-purple)' : 'var(--bg-tertiary)', borderRadius: '12px', padding: '2px', cursor: 'pointer', transition: 'all 0.3s' }}
                  >
                    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', transform: twoFactor ? 'translateX(20px)' : 'translateX(0)', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>SSO & SAML Configuration</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Connect your enterprise identity provider (Okta, Azure AD, etc.).</p>
                  <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => showAlert('Enterprise Feature', 'SSO configuration requires an Enterprise plan add-on.', 'warning')}>
                    <Lock size={16} /> Configure SAML
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Webhooks</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Receive real-time event notifications at your external URL.</p>
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} /> Add Endpoint
                </button>
              </div>
              <div style={{ padding: '20px' }}>
                {webhooks.map(webhook => (
                  <div key={webhook.id} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px', color: 'var(--accent-purple)' }}><Globe size={18} /></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{webhook.url}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Event: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{webhook.event}</span></div>
                      </div>
                    </div>
                    <button style={{ padding: '8px', background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <ConfirmationModal 
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        confirmLabel="Got it"
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={() => setAlertModal({ ...alertModal, isOpen: false })}
        type={alertModal.type}
      />
    </div>
  );
}
