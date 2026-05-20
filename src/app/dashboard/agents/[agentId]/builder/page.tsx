'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Bot, Save, Play, Settings, ChevronLeft, Search, Database, Globe, SlidersHorizontal, MessageSquare, Terminal, X, Paperclip, Send, User, Cpu, Sparkles, AlertCircle, Info, Activity, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAgent, saveAgent } from '@/actions/agent';
import { LLM_MODELS, getModelsByCategory } from '@/lib/engine/constants/models';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

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
  const [leads, setLeads] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [leadCaptureEnabled, setLeadCaptureEnabled] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [marketplacePrice, setMarketplacePrice] = useState(0);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [agentColor, setAgentColor] = useState('#8B5CF6');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingConvs, setIsLoadingConvs] = useState(false);
  const [selectedConv, setSelectedConv] = useState<any>(null);

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
  const [variables, setVariables] = useState<{key: string, value: string, description: string}[]>([
    { key: 'customer_name', value: 'John Doe', description: 'Name of the current customer' },
    { key: 'support_tier', value: 'Enterprise', description: 'User subscription level' }
  ]);
  const [tone, setTone] = useState('professional');
  const [executionLogs, setExecutionLogs] = useState<{type: 'thought' | 'action' | 'output', message: string, timestamp: string}[]>([]);
  const [saveToast, setSaveToast] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'danger' | 'info' | 'warning' }>({ isOpen: false, title: '', message: '', type: 'info' });

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
        if (data.leadCaptureEnabled !== undefined) setLeadCaptureEnabled(data.leadCaptureEnabled);
        if (data.public !== undefined) setIsPublic(data.public);
        if (data.marketplacePrice !== undefined) setMarketplacePrice(data.marketplacePrice);
        if (data.customLogo !== undefined) setCustomLogo(data.customLogo);
        if (data.color !== undefined) setAgentColor(data.color);
      }
    }
    fetchAgent();
  }, [agentId]);

  // Load leads if tab is active
  useEffect(() => {
    if (activeTab === 'leads') {
      const fetchLeads = async () => {
        setIsLoadingLeads(true);
        try {
          const res = await fetch(`/api/agents/${agentId}/leads`);
          const data = await res.json();
          if (data.success) setLeads(data.data);
        } catch (err) {
          console.error('Failed to fetch leads');
        } finally {
          setIsLoadingLeads(false);
        }
      };
      fetchLeads();
    }
    if (activeTab === 'conversations') {
      const fetchConvs = async () => {
        setIsLoadingConvs(true);
        try {
          const res = await fetch(`/api/agents/${agentId}/conversations`);
          const data = await res.json();
          if (data.success) setConversations(data.data);
        } catch (err) {
          console.error('Failed to fetch conversations');
        } finally {
          setIsLoadingConvs(false);
        }
      };
      fetchConvs();
    }
  }, [agentId, activeTab]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await saveAgent(agentId, { 
        name: agentName, 
        description, 
        model, 
        temperature, 
        systemPrompt, 
        knowledge: knowledgeFiles,
        tools, 
        memory,
        leadCaptureEnabled,
        public: isPublic,
        marketplacePrice,
        customLogo,
        color: agentColor,
        status: isPublic ? 'published' : 'draft'
      });
      if (response.success) {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3000);
      } else {
        setAlertModal({ isOpen: true, title: 'Save Failed', message: response.error || 'Failed to save agent.', type: 'danger' });
      }
    } catch (err) {
      setAlertModal({ isOpen: true, title: 'Network Error', message: 'Could not reach the server. Please check your connection.', type: 'danger' });
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
    setExecutionLogs([]); // Reset logs for new run

    // Mock Execution Steps
    const addLog = (type: 'thought' | 'action' | 'output', message: string) => {
      setExecutionLogs(prev => [...prev, { type, message, timestamp: new Date().toLocaleTimeString() }]);
    };

    setTimeout(() => addLog('thought', 'Analyzing user intent...'), 500);
    setTimeout(() => addLog('thought', `Querying knowledge base for "${chatInput.slice(0, 20)}..."`), 1200);
    setTimeout(() => addLog('action', 'Calling tool: WebSearch'), 2000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: `Tone: ${tone}. Variables: ${JSON.stringify(variables)}. ${systemPrompt}`,
          model,
          temperature,
          agentId
        })
      });

      const data = await response.json();
      
      if (data.error) {
        addLog('output', 'Error during execution');
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.error}` }]);
      } else {
        addLog('output', 'Response generated successfully');
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

  const exportLeadsToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Name', 'Email', 'Company', 'Captured At'];
    const rows = leads.map(l => [
      l.name,
      l.email,
      l.company || '',
      new Date(l.createdAt).toLocaleString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${agentName}_leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="builder-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      
           <div className="builder-header" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
          <button onClick={() => router.push('/dashboard/agents')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0 }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{ width: '28px', height: '28px', background: agentColor, color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {customLogo ? (
                <img src={customLogo} alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Bot size={16} />
              )}
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

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Personality & Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} className="focus-ring">
              <option value="professional">Professional & Formal</option>
              <option value="friendly">Friendly & Casual</option>
              <option value="technical">Technical & Precise</option>
              <option value="creative">Creative & Enthusiastic</option>
              <option value="minimalist">Minimalist & Direct</option>
            </select>
          </div>
        </div>

        {/* Center Panel: Prompt Editor & Knowledge Base */}
        <div className="builder-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          <div style={{ padding: '24px 24px 0', borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <button onClick={() => setActiveTab('prompt')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'prompt' ? '2px solid var(--accent-purple)' : '2px solid transparent', color: activeTab === 'prompt' ? 'var(--text-primary)' : 'var(--text-secondary)', paddingBottom: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>System Prompt</button>
              <button onClick={() => setActiveTab('knowledge')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'knowledge' ? '2px solid var(--accent-purple)' : '2px solid transparent', color: activeTab === 'knowledge' ? 'var(--text-primary)' : 'var(--text-secondary)', paddingBottom: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Knowledge <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>{knowledgeFiles.length}</span>
              </button>
              <button onClick={() => setActiveTab('variables')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'variables' ? '2px solid var(--accent-purple)' : '2px solid transparent', color: activeTab === 'variables' ? 'var(--text-primary)' : 'var(--text-secondary)', paddingBottom: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Variables <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>{variables.length}</span>
              </button>
              <button onClick={() => setActiveTab('leads')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'leads' ? '2px solid var(--accent-purple)' : '2px solid transparent', color: activeTab === 'leads' ? 'var(--text-primary)' : 'var(--text-secondary)', paddingBottom: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Leads <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>{leads.length}</span>
              </button>
              <button onClick={() => setActiveTab('conversations')} style={{ background: 'none', border: 'none', borderBottom: activeTab === 'conversations' ? '2px solid var(--accent-purple)' : '2px solid transparent', color: activeTab === 'conversations' ? 'var(--text-primary)' : 'var(--text-secondary)', paddingBottom: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Conversations <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>{conversations.length}</span>
              </button>
            </div>
          </div>
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'prompt' && (
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
            )}

            {activeTab === 'knowledge' && (
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

            {activeTab === 'variables' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Variable Injection</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Define keys to inject dynamic data into your agent's prompt during runtime.</p>
                  </div>
                  <button onClick={() => setVariables([...variables, { key: 'new_variable', value: '', description: '' }])} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', border: 'none', cursor: 'pointer' }}>
                    <Plus size={14} /> Add Variable
                  </button>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>KEY</th>
                        <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>TEST VALUE</th>
                        <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>DESCRIPTION</th>
                        <th style={{ width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {variables.map((v, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                          <td style={{ padding: '12px 20px' }}>
                            <input value={v.key} onChange={(e) => {
                              const newV = [...variables];
                              newV[i].key = e.target.value;
                              setVariables(newV);
                            }} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-mono)' }} />
                          </td>
                          <td style={{ padding: '12px 20px' }}>
                            <input value={v.value} onChange={(e) => {
                              const newV = [...variables];
                              newV[i].value = e.target.value;
                              setVariables(newV);
                            }} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--accent-purple)', fontSize: '13px' }} />
                          </td>
                          <td style={{ padding: '12px 20px' }}>
                            <input value={v.description} onChange={(e) => {
                              const newV = [...variables];
                              newV[i].description = e.target.value;
                              setVariables(newV);
                            }} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-secondary)', fontSize: '12px' }} />
                          </td>
                          <td style={{ padding: '12px 20px' }}>
                            <button onClick={() => setVariables(variables.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}><X size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Captured Leads</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Contacts collected via the Lead Capture Gate on your public chat.</p>
                  </div>
                  <button 
                    onClick={exportLeadsToCSV} 
                    disabled={leads.length === 0}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: leads.length === 0 ? 'default' : 'pointer', opacity: leads.length === 0 ? 0.5 : 1 }}
                  >
                    <Save size={14} /> Export CSV
                  </button>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', overflow: 'hidden' }}>
                  {isLoadingLeads ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <Activity size={32} className="animate-spin" color="var(--text-muted)" style={{ marginBottom: '12px', margin: '0 auto' }} />
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading leads...</div>
                    </div>
                  ) : leads.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <User size={32} color="var(--text-muted)" style={{ marginBottom: '12px', margin: '0 auto' }} />
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>No leads yet</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enable "Lead Capture Gate" in the sidebar to start collecting info.</div>
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>NAME</th>
                          <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL</th>
                          <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>COMPANY</th>
                          <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((l, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                            <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600 }}>{l.name}</td>
                            <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--accent-purple)' }}>{l.email}</td>
                            <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--text-secondary)' }}>{l.company || '—'}</td>
                            <td style={{ padding: '12px 20px', fontSize: '12px', color: 'var(--text-tertiary)' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'conversations' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Chat History</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>View past interactions between users and this agent.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        if (conversations.length === 0) return;
                        const rows = [['Session ID', 'Role', 'Content', 'Timestamp']];
                        conversations.forEach((c: any) => {
                          c.messages.forEach((m: any) => {
                            rows.push([c.sessionId, m.role, `"${(m.content || '').replace(/"/g, '""')}"`, m.timestamp || c.createdAt]);
                          });
                        });
                        const csv = rows.map(r => r.join(',')).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `conversations_${agentId}.csv`;
                        link.click();
                      }}
                      disabled={conversations.length === 0}
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: conversations.length === 0 ? 'default' : 'pointer', opacity: conversations.length === 0 ? 0.5 : 1 }}
                    >
                      <Save size={14} /> CSV
                    </button>
                    <button 
                      onClick={() => {
                        if (conversations.length === 0) return;
                        const blob = new Blob([JSON.stringify(conversations, null, 2)], { type: 'application/json' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `conversations_${agentId}.json`;
                        link.click();
                      }}
                      disabled={conversations.length === 0}
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: conversations.length === 0 ? 'default' : 'pointer', opacity: conversations.length === 0 ? 0.5 : 1 }}
                    >
                      <Save size={14} /> JSON
                    </button>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px', overflow: 'hidden' }}>
                  {isLoadingConvs ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <Activity size={32} className="animate-spin" color="var(--text-muted)" style={{ marginBottom: '12px', margin: '0 auto' }} />
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading conversations...</div>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <MessageSquare size={32} color="var(--text-muted)" style={{ marginBottom: '12px', margin: '0 auto' }} />
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>No history yet</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Deploy your agent to start seeing conversation logs.</div>
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>SESSION</th>
                          <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>MESSAGES</th>
                          <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>LAST ACTIVE</th>
                          <th style={{ width: '120px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversations.map((c, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                            <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{c.sessionId.slice(0, 8)}...</td>
                            <td style={{ padding: '12px 20px', fontSize: '13px' }}>{c.messages.length} messages</td>
                            <td style={{ padding: '12px 20px', fontSize: '12px', color: 'var(--text-tertiary)' }}>{new Date(c.updatedAt || c.createdAt).toLocaleString()}</td>
                            <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                              <button 
                                onClick={() => setSelectedConv(c)}
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
                              >
                                View Chat
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

            <div style={{ padding: '16px', background: 'var(--bg-card)', border: leadCaptureEnabled ? '1px solid var(--border-focus)' : '1px solid var(--border-primary)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setLeadCaptureEnabled(!leadCaptureEnabled)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', color: leadCaptureEnabled ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  <User size={16} color={leadCaptureEnabled ? "var(--accent-green)" : "var(--text-tertiary)"} /> Lead Capture Gate
                </div>
                <div style={{ width: '36px', height: '20px', background: leadCaptureEnabled ? 'var(--accent-purple)' : 'var(--bg-input)', borderRadius: '10px', position: 'relative', transition: 'all 0.2s' }}>
                  <div style={{ position: 'absolute', top: '2px', left: leadCaptureEnabled ? '18px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'all 0.2s' }}></div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Collect user info before starting a chat.</div>
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

          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '32px 0 20px' }}>Marketplace</h3>

          <div style={{ padding: '16px', background: 'var(--bg-card)', border: isPublic ? '1px solid var(--border-focus)' : '1px solid var(--border-primary)', borderRadius: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', color: isPublic ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <Globe size={16} color={isPublic ? "var(--accent-blue)" : "var(--text-tertiary)"} /> Public Listing
              </div>
              <div 
                onClick={() => setIsPublic(!isPublic)}
                style={{ width: '36px', height: '20px', background: isPublic ? 'var(--accent-purple)' : 'var(--bg-input)', borderRadius: '10px', position: 'relative', transition: 'all 0.2s', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', top: '2px', left: isPublic ? '18px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'all 0.2s' }}></div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>List your agent on the global marketplace.</div>
            
            {isPublic && (
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Price (USD)</div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: 'var(--text-tertiary)' }}>$</span>
                  <input 
                    type="number" 
                    value={marketplacePrice} 
                    onChange={(e) => setMarketplacePrice(Number(e.target.value))}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '8px 8px 8px 24px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} 
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Set to 0 for free agents.</div>
              </div>
            )}
          </div>

          <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '32px 0 20px' }}>Custom Branding</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Chat Theme Color</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#06B6D4'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setAgentColor(c)} 
                    style={{ width: '28px', height: '28px', background: c, borderRadius: '50%', border: agentColor === c ? '2px solid white' : 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: agentColor === c ? '0 0 0 2px var(--accent-purple)' : 'none' }} 
                  />
                ))}
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Bot Logo URL</div>
              <input 
                type="text" 
                placeholder="https://example.com/logo.png" 
                value={customLogo || ''} 
                onChange={(e) => setCustomLogo(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }} 
              />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Paste a link to your custom logo image.</div>
              {customLogo && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={customLogo} alt="Logo Preview" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-primary)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Preview</span>
                </div>
              )}
            </div>
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

          {/* Execution Trace (New) */}
          {executionLogs.length > 0 && (
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', padding: '12px 16px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Activity size={12} /> EXECUTION TRACE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {executionLogs.map((log, i) => (
                  <div key={i} style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: log.type === 'thought' ? 'var(--accent-cyan)' : log.type === 'action' ? 'var(--accent-purple)' : 'var(--accent-green)' }}>
                      [{log.type.toUpperCase()}]
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  maxWidth: '85%', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  background: msg.role === 'user' ? (agentColor || 'var(--text-primary)') : 'var(--bg-secondary)', 
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
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
              <button onClick={handleSendMessage} style={{ background: agentColor || 'var(--text-primary)', color: 'white', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      {/* Conversation Detail Modal */}
      {selectedConv && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ width: '700px', maxHeight: '80vh', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Session {selectedConv.sessionId.slice(0, 12)}...</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{new Date(selectedConv.createdAt).toLocaleString()}</div>
              </div>
              <button onClick={() => setSelectedConv(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-primary)' }}>
              {selectedConv.messages.map((m: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '16px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: m.role === 'user' ? 'var(--bg-tertiary)' : 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', color: m.role === 'user' ? 'var(--text-primary)' : 'white', fontWeight: 700 }}>
                    {m.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div style={{ 
                    maxWidth: '80%', padding: '12px 16px', borderRadius: '12px', 
                    background: m.role === 'user' ? 'var(--bg-card)' : 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)', fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)'
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => {
                  const content = JSON.stringify(selectedConv, null, 2);
                  const blob = new Blob([content], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `chat_${selectedConv.sessionId.slice(0,8)}.json`;
                  a.click();
                }}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                Export JSON
              </button>
              <button onClick={() => setSelectedConv(null)} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Toast */}
      {saveToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--accent-green)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}
        >
          <Save size={16} /> Agent saved successfully
        </motion.div>
      )}

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
