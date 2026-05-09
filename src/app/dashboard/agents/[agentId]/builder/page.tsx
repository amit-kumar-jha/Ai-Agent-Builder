'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Bot, Save, Play, Settings, ChevronLeft, Search, Database, Globe, SlidersHorizontal, MessageSquare, Terminal, X, Paperclip, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAgent, saveAgent } from '@/actions/agent';
import { LLM_MODELS, getModelsByCategory } from '@/lib/engine/constants/models';

export default function AgentBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;

  const [agentName, setAgentName] = useState('Customer Support Bot');
  const [description, setDescription] = useState('AI-powered customer support agent with multi-step reasoning.');
  const [model, setModel] = useState('llama3.2');
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful customer support assistant for NexAgeAI.\\n\\nAlways be polite and concise.\\nIf you don't know the answer, use the search tool.");
  
  const [activeTab, setActiveTab] = useState('prompt');
  const [knowledgeFiles, setKnowledgeFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const [tools, setTools] = useState({
    webSearch: true,
    fileReader: false,
    calculator: false,
    customApi: true
  });
  const [memory, setMemory] = useState(true);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hello! I am your configured agent. How can I help you test my capabilities today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing agent data on mount
  useEffect(() => {
    async function fetchAgent() {
      const data = await getAgent(agentId);
      if (data && !data.error) {
        // getAgent returns agent object directly
        if (data.name) setAgentName(data.name);
        if (data.description) setDescription(data.description);
        if (data.model) setModel(data.model);
        if (data.temperature !== undefined) setTemperature(data.temperature);
        if (data.systemPrompt) setSystemPrompt(data.systemPrompt);
        if (data.knowledge && data.knowledge.length > 0) setKnowledgeFiles(data.knowledge);
        if (data.tools) setTools({ ...tools, ...data.tools });
        if (data.memory !== undefined) setMemory(data.memory);
      }
    }
    fetchAgent();
  }, [agentId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await saveAgent(agentId, { name: agentName, description, model, temperature, systemPrompt, tools, memory });
      if (response.success) {
        // Optionally show a toast notification here
      } else {
        alert(response.error || 'Failed to save agent.');
      }
    } catch (err) {
      alert('Network error while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: chatInput };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt,
          model,
          temperature,
          agentId
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Network error: Failed to connect to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadKnowledge = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5MB.');
      return;
    }

    // Validate file type on client side too
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = ['.txt', '.md', '.csv', '.json', '.log', '.xml', '.html', '.pdf'];
    if (!allowed.includes(ext)) {
      alert(`Unsupported file type: ${ext}\nAllowed: ${allowed.join(', ')}`);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/agents/${agentId}/knowledge`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Upload response:', data);

      if (data.success && data.document) {
        setKnowledgeFiles(prev => [...prev.filter(f => f.fileName !== data.document.fileName), data.document]);
        alert(`✅ "${file.name}" uploaded successfully! Your agent now has access to this data.`);
      } else {
        alert(`❌ Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`❌ Network error: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleScrapeUrl = async () => {
    const url = prompt('Enter the URL to scrape and add to knowledge base:');
    if (!url) return;
    
    try {
      new URL(url);
    } catch {
      alert('Invalid URL format. Make sure it includes http:// or https://');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('url', url);

    try {
      const res = await fetch(`/api/agents/${agentId}/knowledge`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success && data.document) {
        setKnowledgeFiles(prev => [...prev.filter(f => f.fileName !== data.document.fileName), data.document]);
        alert(`✅ URL scraped successfully! Added as "${data.document.fileName}".`);
      } else {
        alert(`❌ Scrape failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Scrape error:', err);
      alert(`❌ Network error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteKnowledge = async (fileName: string) => {
    if (!confirm(`Delete "${fileName}" from knowledge base?`)) return;
    try {
      const res = await fetch(`/api/agents/${agentId}/knowledge?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setKnowledgeFiles(prev => prev.filter(f => f.fileName !== fileName));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Failed to delete document');
    }
  };

  return (
    <div className="builder-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      
           <div className="builder-header" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
          <button onClick={() => router.push('/dashboard/agents')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0 }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{ width: '28px', height: '28px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={16} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{agentName}</div>
            <div className="desktop-only" style={{ padding: '2px 8px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-amber)', fontSize: '11px', fontWeight: 600, borderRadius: '4px' }}>Draft</div>
          </div>
        </div>
        
        <div className="builder-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setChatOpen(!chatOpen)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <Terminal size={14} /> <span className="desktop-only">{chatOpen ? 'Close Preview' : 'Test Agent'}</span>
          </button>
          
          <button onClick={() => setShowEmbedModal(true)} className="desktop-only" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <Globe size={14} /> Embed
          </button>

          <button onClick={() => window.open(`/chat/${agentId}`, '_blank')} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <Globe size={14} /> <span className="desktop-only">Make Live</span>
          </button>
          
          <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>
            <Save size={14} /> <span>{isSaving ? '...' : 'Save'}</span><span className="desktop-only">{isSaving ? '' : ' Changes'}</span>
          </button>
        </div>
      </div>

      <div className="builder-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Panel: Configuration */}
        <div className="builder-sidebar" style={{ width: '320px', borderRight: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', overflowY: 'auto', padding: '24px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '20px' }}>Configuration</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Agent Name</label>
            <input value={agentName} onChange={(e) => setAgentName(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)' }} className="focus-ring" />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '13px', outline: 'none', minHeight: '80px', color: 'var(--text-primary)', resize: 'vertical' }} className="focus-ring" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-primary)', margin: '24px 0' }}></div>

          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '20px' }}>Model Settings</h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Provider & Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)', cursor: 'pointer', appearance: 'none' }} className="focus-ring">
              <optgroup label="🆓 Free (OpenRouter)">
                {getModelsByCategory('free').map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
              <optgroup label="🖥️ Local (Ollama)">
                {getModelsByCategory('local').map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
              <optgroup label="💎 Premium (Paid API)">
                {getModelsByCategory('premium').map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
            </select>
            {LLM_MODELS[model] && (
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ padding: '2px 6px', borderRadius: '4px', background: LLM_MODELS[model].free ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: LLM_MODELS[model].free ? 'var(--accent-green)' : 'var(--accent-amber)', fontWeight: 600, fontSize: '10px' }}>
                  {LLM_MODELS[model].free ? 'FREE' : `$${LLM_MODELS[model].costPerMillionInput}/M tokens`}
                </span>
                {LLM_MODELS[model].description}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Temperature</label>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{temperature}</span>
            </div>
            <input type="range" min="0" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-purple)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>
        </div>

        {/* Center Panel: Prompt Editor & Knowledge Base */}
        <div className="builder-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          <div style={{ padding: '24px 24px 0', borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <button onClick={() => setActiveTab('prompt')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'prompt' ? '2px solid var(--accent-purple)' : '2px solid transparent', color: activeTab === 'prompt' ? 'var(--text-primary)' : 'var(--text-secondary)', paddingBottom: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>System Prompt</button>
              <button onClick={() => setActiveTab('knowledge')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'knowledge' ? '2px solid var(--accent-purple)' : '2px solid transparent', color: activeTab === 'knowledge' ? 'var(--text-primary)' : 'var(--text-secondary)', paddingBottom: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Knowledge Base <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>{knowledgeFiles.length}</span>
              </button>
            </div>
          </div>
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            
            {activeTab === 'prompt' ? (
              <div style={{ flex: 1, border: '1px solid var(--border-secondary)', borderRadius: '12px', background: 'var(--bg-card)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Edit</span>
                  <span>Variables</span>
                </div>
                <textarea 
                  value={systemPrompt} 
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  style={{ flex: 1, width: '100%', padding: '20px', background: 'transparent', border: 'none', resize: 'none', fontSize: '14px', lineHeight: 1.6, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', outline: 'none' }}
                  placeholder="Enter system instructions here..."
                />
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Reference Documents</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Upload text or markdown files to give your agent context (RAG).</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleScrapeUrl} disabled={isUploading} style={{ cursor: isUploading ? 'wait' : 'pointer', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: isUploading ? 0.7 : 1 }}>
                      <Globe size={14} /> {isUploading ? 'Working...' : 'Scrape URL'}
                    </button>
                    <label style={{ cursor: isUploading ? 'wait' : 'pointer', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: isUploading ? 0.7 : 1 }}>
                      <input type="file" accept=".txt,.md,.csv,.json,.log,.xml,.html,.pdf" style={{ display: 'none' }} onChange={handleUploadKnowledge} disabled={isUploading} />
                      <Paperclip size={14} /> {isUploading ? 'Uploading...' : 'Upload File'}
                    </label>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', overflow: 'hidden' }}>
                  {knowledgeFiles.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <Database size={32} color="var(--text-muted)" style={{ marginBottom: '12px', margin: '0 auto' }} />
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>No documents uploaded</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Upload files to improve your agent's responses.</div>
                    </div>
                  ) : (
                    knowledgeFiles.map((file, i) => (
                      <div key={i} style={{ padding: '16px 20px', borderBottom: i < knowledgeFiles.length - 1 ? '1px solid var(--border-primary)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ padding: '8px', background: 'var(--bg-input)', borderRadius: '8px', color: 'var(--text-secondary)' }}><Database size={16} /></div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{file.fileName}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{(file.size / 1024).toFixed(1)} KB • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteKnowledge(file.fileName)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '8px' }}><X size={16} /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Tools & Memory */}
        <div className="builder-sidebar" style={{ width: '320px', borderLeft: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', overflowY: 'auto', padding: '24px' }}>
          
          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '20px' }}>Tools & Capabilities</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-card)', border: tools.webSearch ? '1px solid var(--border-focus)' : '1px solid var(--border-primary)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setTools({...tools, webSearch: !tools.webSearch})}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', color: tools.webSearch ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  <Globe size={16} color={tools.webSearch ? "var(--accent-blue)" : "var(--text-tertiary)"} /> Web Search
                </div>
                <div style={{ width: '36px', height: '20px', background: tools.webSearch ? 'var(--accent-purple)' : 'var(--bg-input)', borderRadius: '10px', position: 'relative', transition: 'all 0.2s' }}>
                  <div style={{ position: 'absolute', top: '2px', left: tools.webSearch ? '18px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'all 0.2s' }}></div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Allow agent to search the web for real-time information.</div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-card)', border: tools.customApi ? '1px solid var(--border-focus)' : '1px solid var(--border-primary)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setTools({...tools, customApi: !tools.customApi})}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', color: tools.customApi ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  <SlidersHorizontal size={16} color={tools.customApi ? "var(--accent-amber)" : "var(--text-tertiary)"} /> Custom API
                </div>
                <div style={{ width: '36px', height: '20px', background: tools.customApi ? 'var(--accent-purple)' : 'var(--bg-input)', borderRadius: '10px', position: 'relative', transition: 'all 0.2s' }}>
                  <div style={{ position: 'absolute', top: '2px', left: tools.customApi ? '18px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'all 0.2s' }}></div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Call external REST endpoints or webhooks.</div>
            </div>
          </div>

          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '20px' }}>Memory & Context</h3>

          <div style={{ padding: '16px', background: 'var(--bg-card)', border: memory ? '1px solid var(--border-focus)' : '1px solid var(--border-primary)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setMemory(!memory)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', color: memory ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <Database size={16} color={memory ? "var(--accent-green)" : "var(--text-tertiary)"} /> Persistent Memory
              </div>
              <div style={{ width: '36px', height: '20px', background: memory ? 'var(--accent-purple)' : 'var(--bg-input)', borderRadius: '10px', position: 'relative', transition: 'all 0.2s' }}>
                <div style={{ position: 'absolute', top: '2px', left: memory ? '18px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'all 0.2s' }}></div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Agent remembers past conversations using vector storage.</div>
          </div>

        </div>

      </div>

      {/* Floating Chat Preview Panel */}
      {chatOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          className="shadow-lg builder-chat-preview"
          style={{ position: 'absolute', bottom: '24px', right: '24px', width: '400px', height: '600px', background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: '16px', display: 'flex', flexDirection: 'column', zIndex: 100, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
        >
          {/* Chat Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--accent-green)', borderRadius: '50%' }}></div>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>Live Preview</span>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  maxWidth: '85%', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  background: msg.role === 'user' ? 'var(--text-primary)' : 'var(--bg-secondary)', 
                  color: msg.role === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  border: msg.role !== 'user' ? '1px solid var(--border-primary)' : 'none'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', fontSize: '13px', border: '1px solid var(--border-primary)', display: 'flex', gap: '4px' }}>
                  <div className="typing-dot">.</div><div className="typing-dot" style={{ animationDelay: '0.2s' }}>.</div><div className="typing-dot" style={{ animationDelay: '0.4s' }}>.</div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '24px', padding: '8px 16px', opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0' }}><Paperclip size={16} /></button>
              <input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Test your agent..." 
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: 'var(--text-primary)' }} 
              />
              <button onClick={handleSendMessage} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Embed Modal */}
      {showEmbedModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="builder-modal" style={{ width: '600px', maxWidth: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={20} color="var(--accent-purple)" /> Embed on your website</h3>
              <button onClick={() => setShowEmbedModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Copy and paste this code snippet into the <code>&lt;head&gt;</code> or <code>&lt;body&gt;</code> of your website to add this AI agent as a floating chat widget.</p>
              
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <pre style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', overflowX: 'auto', border: '1px solid var(--border-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {`<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://agentos.app'}/widget.js" data-agent-id="${agentId}" defer></script>`}
                </pre>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://agentos.app'}/widget.js" data-agent-id="${agentId}" defer></script>`);
                    setCopiedEmbed(true);
                    setTimeout(() => setCopiedEmbed(false), 2000);
                  }}
                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: copiedEmbed ? 'var(--accent-green)' : 'var(--text-primary)' }}
                >
                  {copiedEmbed ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                <div style={{ color: 'var(--accent-cyan)' }}><Settings size={20} /></div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '4px' }}>Widget Customization</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>The widget will automatically match your agent's name, greeting, and theme color configured in these settings.</p>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowEmbedModal(false)} className="btn btn-primary">Done</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
