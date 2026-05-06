'use client';
import { Link2, Search, Zap, CheckCircle2 } from 'lucide-react';

const integrations = [
  { id: 'slack', name: 'Slack', description: 'Deploy agents directly to your Slack workspace', connected: true, icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' },
  { id: 'discord', name: 'Discord', description: 'Add AI bots to your Discord server', connected: false, icon: 'https://cdn.worldvectorlogo.com/logos/discord-6.svg' },
  { id: 'github', name: 'GitHub', description: 'Allow agents to read repositories and create PRs', connected: true, icon: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg' },
  { id: 'zendesk', name: 'Zendesk', description: 'Draft and reply to support tickets automatically', connected: false, icon: 'https://cdn.worldvectorlogo.com/logos/zendesk-1.svg' },
  { id: 'salesforce', name: 'Salesforce', description: 'Sync leads and update CRM records', connected: false, icon: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg' },
  { id: 'notion', name: 'Notion', description: 'Read and write to your Notion workspace', connected: false, icon: 'https://cdn.worldvectorlogo.com/logos/notion-logo-1.svg' },
];

export default function IntegrationsPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Integrations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Connect AgentOS to your favorite tools and platforms.</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            placeholder="Search integrations..." 
            style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {integrations.map((app) => (
          <div key={app.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }} className="hover-bg-glass">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-secondary)' }}>
                {app.icon ? <img src={app.icon} alt={app.name} style={{ width: '24px', height: '24px', filter: app.name === 'GitHub' || app.name === 'Notion' ? 'invert(var(--invert-icon, 0))' : 'none' }} /> : <Link2 size={24} />}
              </div>
              {app.connected && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '12px', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                  <CheckCircle2 size={14} /> Connected
                </div>
              )}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{app.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '24px' }}>{app.description}</p>
            <button style={{ width: '100%', padding: '10px', background: app.connected ? 'var(--bg-input)' : 'var(--text-primary)', color: app.connected ? 'var(--text-secondary)' : 'var(--bg-primary)', border: app.connected ? '1px solid var(--border-primary)' : 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {app.connected ? 'Manage Settings' : <><Zap size={14} /> Connect</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
