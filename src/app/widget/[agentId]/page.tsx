'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Bot, Send, Loader2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function WidgetPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // Managed by parent via postMessage but we track state for animation
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Notify parent frame that iframe is loaded
    window.parent.postMessage({ type: 'AGENTOS_WIDGET_LOADED' }, '*');

    // Listen for open/close commands from parent
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'AGENTOS_TOGGLE') {
        setIsOpen(e.data.isOpen);
      }
    };
    window.addEventListener('message', handleMessage);

    // Fetch agent config
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/agents/${agentId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setAgentConfig(data.data);
          setMessages([{ role: 'assistant', content: data.data.settings?.greeting || `Hi! I'm ${data.data.name}. How can I help you today?` }]);
        } else {
          setMessages([{ role: 'assistant', content: 'Agent not found or unavailable.' }]);
        }
      } catch (e) {
        setMessages([{ role: 'assistant', content: 'Failed to connect to agent.' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();

    return () => window.removeEventListener('message', handleMessage);
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping || !agentConfig) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: agentConfig.systemPrompt || '',
          model: agentConfig.model || 'llama3.2',
          temperature: agentConfig.temperature ?? 0.7,
          agentId,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Network error.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const closeWidget = () => {
    window.parent.postMessage({ type: 'AGENTOS_CLOSE' }, '*');
  };

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '16px', background: agentConfig?.color || 'var(--accent-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            {agentConfig?.icon || '🤖'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{agentConfig?.name || 'Agent'}</div>
            <div style={{ fontSize: '11px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }}></span> Online
            </div>
          </div>
        </div>
        <button onClick={closeWidget} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0.8'}>
          <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role !== 'user' && (
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px', marginLeft: '4px' }}>{agentConfig?.name || 'Agent'}</span>
            )}
            <div style={{ 
              maxWidth: '85%', 
              padding: '12px 16px', 
              borderRadius: '16px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.role !== 'user' ? '4px' : '16px',
              background: msg.role === 'user' ? (agentConfig?.color || 'var(--accent-purple)') : 'var(--bg-card)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              border: msg.role !== 'user' ? '1px solid var(--border-primary)' : 'none',
              fontSize: '14px',
              lineHeight: 1.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', display: 'flex', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-tertiary)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-tertiary)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-tertiary)', animation: 'bounce 1.4s infinite ease-in-out both' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-primary)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '12px 16px', paddingRight: '48px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '24px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: input.trim() && !isTyping ? (agentConfig?.color || 'var(--accent-purple)') : 'transparent', color: input.trim() && !isTyping ? '#fff' : 'var(--text-muted)', border: 'none', borderRadius: '50%', cursor: input.trim() && !isTyping ? 'pointer' : 'default', transition: 'all 0.2s' }}
          >
            <Send size={16} style={{ marginLeft: input.trim() && !isTyping ? '2px' : '0' }} />
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '10px', color: 'var(--text-tertiary)' }}>
          Powered by <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>NexAgeAI</a>
        </div>
      </div>
    </div>
  );
}
