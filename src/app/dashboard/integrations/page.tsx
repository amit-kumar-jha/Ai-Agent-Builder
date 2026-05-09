'use client';
import { useState } from 'react';
import { Link2, Search, Zap, CheckCircle2, X, ChevronRight, Copy, Terminal, ExternalLink } from 'lucide-react';

const integrationsData = [
  { 
    id: 'slack', 
    name: 'Slack', 
    description: 'Deploy agents directly to your Slack workspace to answer questions in channels.', 
    connected: true, 
    icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
    steps: [
      { title: 'Create a Slack App', content: 'Go to api.slack.com/apps and click "Create New App". Choose "From scratch" and select your workspace.' },
      { title: 'Add OAuth Scopes', content: 'Under "OAuth & Permissions", add the following Bot Token Scopes: chat:write, app_mentions:read, and channels:history.' },
      { title: 'Install to Workspace', content: 'Scroll up and click "Install to Workspace". This will generate a Bot User OAuth Token.' },
      { title: 'Configure Webhook', content: 'Enable "Event Subscriptions", set the Request URL to your NexAgeAI webhook endpoint, and subscribe to "app_mention" and "message.channels" events.' }
    ],
    configFields: [
      { label: 'Bot User OAuth Token', type: 'password', placeholder: 'xoxb-...' },
      { label: 'Signing Secret', type: 'password', placeholder: '...' }
    ]
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp (Twilio)', 
    description: 'Scale your customer support on WhatsApp using Twilio Sandbox or API.', 
    connected: false, 
    icon: 'https://cdn.worldvectorlogo.com/logos/whatsapp-symbol.svg',
    steps: [
      { title: 'Twilio Console', content: 'Log in to your Twilio console and navigate to Messaging > Try it Out > Send a WhatsApp Message.' },
      { title: 'Configure Sandbox', content: 'Send the join code to the Twilio number to activate the sandbox.' },
      { title: 'Set Webhook URL', content: 'In Sandbox Settings, paste your NexAgeAI webhook URL into the "When a message comes in" field.' }
    ],
    configFields: [
      { label: 'Account SID', type: 'text', placeholder: 'AC...' },
      { label: 'Auth Token', type: 'password', placeholder: '...' },
      { label: 'Twilio Phone Number', type: 'text', placeholder: '+1...' }
    ]
  },
  { 
    id: 'notion', 
    name: 'Notion', 
    description: 'Sync your Notion pages and databases to build a dynamic knowledge base.', 
    connected: false, 
    icon: 'https://cdn.worldvectorlogo.com/logos/notion-2.svg',
    steps: [
      { title: 'Create Integration', content: 'Go to notion.so/my-integrations and create a new internal integration.' },
      { title: 'Share Pages', content: 'Open the Notion page you want to sync, click "...", and under "Add connections", select your integration.' },
      { title: 'Copy Token', content: 'Copy the Internal Integration Token and paste it into the configuration below.' }
    ],
    configFields: [
      { label: 'Integration Token', type: 'password', placeholder: 'secret_...' },
      { label: 'Database ID', type: 'text', placeholder: '...' }
    ]
  },
  { 
    id: 'hubspot', 
    name: 'HubSpot', 
    description: 'Automate lead scoring and CRM updates based on AI conversations.', 
    connected: false, 
    icon: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg',
    steps: [
      { title: 'Private App', content: 'In HubSpot settings, go to Integrations > Private Apps and create a new app.' },
      { title: 'Set Scopes', content: 'Grant crm.objects.contacts:write and crm.objects.deals:write permissions.' },
      { title: 'Access Token', type: 'password', content: 'Copy the Access Token from the "Auth" tab.' }
    ],
    configFields: [
      { label: 'Access Token', type: 'password', placeholder: 'pat-na1-...' }
    ]
  },
  { 
    id: 'discord', 
    name: 'Discord', 
    description: 'Add AI bots to your Discord server to interact with your community.', 
    connected: false, 
    icon: 'https://cdn.worldvectorlogo.com/logos/discord-6.svg',
    steps: [
      { title: 'Create Application', content: 'Go to the Discord Developer Portal, click "New Application", and give your bot a name.' },
      { title: 'Enable Privileged Intents', content: 'In the "Bot" tab, toggle on "Message Content Intent" so the bot can read user messages.' },
      { title: 'Generate Token', content: 'Click "Reset Token" to get your Bot Token. Keep this secret!' },
      { title: 'Invite Bot', content: 'Go to OAuth2 > URL Generator. Select "bot" and "applications.commands" scopes, grant necessary text permissions, and open the generated URL to invite it to your server.' }
    ],
    configFields: [
      { label: 'Discord Bot Token', type: 'password', placeholder: '...' },
      { label: 'Application ID', type: 'text', placeholder: '...' }
    ]
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    description: 'Allow agents to read repositories, create PRs, and review code.', 
    connected: true, 
    icon: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg',
    steps: [
      { title: 'Create a GitHub App', content: 'In your GitHub Developer Settings, create a new GitHub App.' },
      { title: 'Set Permissions', content: 'Grant Read/Write access to Repository Contents, Pull Requests, and Issues.' },
      { title: 'Configure Webhooks', content: 'Add the NexAgeAI webhook URL to receive events when PRs or Issues are opened.' },
      { title: 'Generate Private Key', content: 'Generate and download a private key for your GitHub App to authenticate API requests.' }
    ],
    configFields: [
      { label: 'GitHub App ID', type: 'text', placeholder: '...' },
      { label: 'Installation ID', type: 'text', placeholder: '...' },
      { label: 'Private Key', type: 'textarea', placeholder: '-----BEGIN RSA PRIVATE KEY-----...' }
    ]
  },
  { 
    id: 'zapier', 
    name: 'Zapier', 
    description: 'Connect your AI agents to 5000+ apps via custom Zapier actions.', 
    connected: false, 
    icon: 'https://cdn.worldvectorlogo.com/logos/zapier-2.svg',
    steps: [
      { title: 'NexAgeAI App', content: 'Search for NexAgeAI in the Zapier App Directory and click "Connect".' },
      { title: 'API Authentication', content: 'Paste your workspace API key when prompted by Zapier.' },
      { title: 'Create Trigger', content: 'Choose "New Agent Response" as your trigger to start workflows when an agent speaks.' }
    ],
    configFields: [
      { label: 'API Key', type: 'password', placeholder: 'sk_...' }
    ]
  },
  { 
    id: 'make', 
    name: 'Make.com', 
    description: 'Build complex visual automations with NexAgeAI modules.', 
    connected: false, 
    icon: 'https://cdn.worldvectorlogo.com/logos/make-5.svg',
    steps: [
      { title: 'Add Module', content: 'In Make, search for the NexAgeAI module and add it to your scenario.' },
      { title: 'Connection', content: 'Create a new connection and enter your API key and Workspace ID.' },
      { title: 'Webhook', content: 'Add a Webhook module to receive real-time data from NexAgeAI agents.' }
    ],
    configFields: [
      { label: 'API Key', type: 'password', placeholder: 'sk_...' },
      { label: 'Workspace ID', type: 'text', placeholder: '...' }
    ]
  },
  { 
    id: 'intercom', 
    name: 'Intercom', 
    description: 'Power your Intercom Messenger with intelligent AI auto-replies.', 
    connected: false, 
    icon: 'https://cdn.worldvectorlogo.com/logos/intercom-2.svg',
    steps: [
      { title: 'Developer Hub', content: 'Create a new app in the Intercom Developer Hub.' },
      { title: 'Enable Webhooks', content: 'Subscribe to "conversation.user.created" and "conversation.user.replied" events.' },
      { title: 'Get Access Token', content: 'Copy your permanent Access Token to connect NexAgeAI.' }
    ],
    configFields: [
      { label: 'Access Token', type: 'password', placeholder: 'dgaf_...' }
    ]
  },
  { 
    id: 'api', 
    name: 'Custom REST API', 
    description: 'Integrate your agent directly into your own app via REST API.', 
    connected: true, 
    icon: 'https://cdn.worldvectorlogo.com/logos/code-1.svg',
    steps: [
      { title: 'Generate API Key', content: 'Generate a long-lived NexAgeAI API key from your workspace settings.' },
      { title: 'Send Messages', content: 'Make a POST request to https://api.nexageai.com/v1/chat/completions with your agent ID.' },
      { title: 'Handle Streaming', content: 'Use Server-Sent Events (SSE) to handle streaming responses for a better user experience.' }
    ],
    configFields: [
      { label: 'Agent ID', type: 'text', placeholder: '...' }
    ]
  },
];

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<any | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const filteredIntegrations = integrationsData.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Integrations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Connect NexAgeAI to your favorite tools and platforms.</p>
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            placeholder="Search integrations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)' }}
            className="focus-ring"
          />
        </div>
      </div>

      <div className="integrations-grid responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredIntegrations.map((app) => (
          <div key={app.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }} className="hover-bg-glass">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-secondary)', overflow: 'hidden' }}>
                {app.id === 'api' ? <Terminal size={24} color="var(--accent-blue)" /> : 
                  <img src={app.icon} alt={app.name} style={{ width: '24px', height: '24px', filter: app.name === 'GitHub' || app.name === 'Notion' ? 'invert(var(--invert-icon, 0))' : 'none', objectFit: 'contain' }} />
                }
              </div>
              {app.connected && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '12px', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                  <CheckCircle2 size={14} /> Connected
                </div>
              )}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{app.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '24px' }}>{app.description}</p>
            <button 
              onClick={() => { setSelectedIntegration(app); setIsConfiguring(false); }}
              style={{ width: '100%', padding: '10px', background: app.connected ? 'var(--bg-input)' : 'var(--text-primary)', color: app.connected ? 'var(--text-secondary)' : 'var(--bg-primary)', border: app.connected ? '1px solid var(--border-primary)' : 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {app.connected ? 'Manage Integration' : <><Zap size={14} /> Connect</>}
            </button>
          </div>
        ))}
      </div>

      {selectedIntegration && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setSelectedIntegration(null)} />
          <div className="integrations-modal" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: '600px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-secondary)' }}>
                  {selectedIntegration.id === 'api' ? <Terminal size={20} color="var(--accent-blue)" /> : 
                    <img src={selectedIntegration.icon} alt={selectedIntegration.name} style={{ width: '20px', height: '20px', filter: selectedIntegration.name === 'GitHub' ? 'invert(var(--invert-icon, 0))' : 'none' }} />
                  }
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedIntegration.name} Integration</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedIntegration.connected ? 'var(--accent-green)' : 'var(--text-muted)' }} />
                    {selectedIntegration.connected ? 'Active & Connected' : 'Not Connected'}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedIntegration(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button 
                  onClick={() => setIsConfiguring(false)}
                  style={{ flex: 1, padding: '10px', background: !isConfiguring ? 'var(--bg-input)' : 'transparent', border: '1px solid', borderColor: !isConfiguring ? 'var(--border-primary)' : 'transparent', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: !isConfiguring ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  How to setup
                </button>
                <button 
                  onClick={() => setIsConfiguring(true)}
                  style={{ flex: 1, padding: '10px', background: isConfiguring ? 'var(--bg-input)' : 'transparent', border: '1px solid', borderColor: isConfiguring ? 'var(--border-primary)' : 'transparent', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: isConfiguring ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Configuration
                </button>
              </div>

              {!isConfiguring ? (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} color="var(--accent-purple)" /> Integration Guide
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {selectedIntegration.steps.map((step: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>
                          {idx + 1}
                        </div>
                        <div>
                          <h5 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{step.title}</h5>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Your Webhook URL</h5>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>You will need to paste this URL into the {selectedIntegration.name} developer console.</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <code style={{ flex: 1, padding: '10px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '12px', color: 'var(--accent-purple)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        https://api.nexageai.com/v1/webhooks/{selectedIntegration.id}/YOUR_WORKSPACE_ID
                      </code>
                      <button onClick={() => handleCopy(`https://api.nexageai.com/v1/webhooks/${selectedIntegration.id}/YOUR_WORKSPACE_ID`)} style={{ padding: '8px 12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={16} color="var(--accent-cyan)" /> API Credentials
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {selectedIntegration.configFields.map((field: any, idx: number) => (
                      <div key={idx}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>{field.label}</label>
                        {field.type === 'textarea' ? (
                          <textarea 
                            placeholder={field.placeholder}
                            style={{ width: '100%', height: '100px', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', resize: 'none', fontFamily: 'monospace' }}
                            className="focus-ring"
                          />
                        ) : (
                          <input 
                            type={field.type}
                            placeholder={field.placeholder}
                            defaultValue={selectedIntegration.connected ? '************************' : ''}
                            style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none' }}
                            className="focus-ring"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
                    <button style={{ flex: 1, padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                      Save Configuration
                    </button>
                    {selectedIntegration.connected && (
                      <button style={{ padding: '12px 24px', background: 'transparent', color: 'var(--accent-red)', border: '1px solid var(--accent-red)', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookOpen(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}

function Settings(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
}
