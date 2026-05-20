'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Bot, Send, Loader2, RotateCcw, Copy, Check, Sparkles, ChevronDown, Settings2, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ─────────────────────────────────────────────
// Markdown renderer for AI responses
// ─────────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  let blockIndex = 0;

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(idx);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Code blocks with syntax highlighting + copy button
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const code = String(children).replace(/\n$/, '');
          const currentIdx = blockIndex++;

          if (match) {
            return (
              <div className="chat-code-block">
                <div className="chat-code-header">
                  <span className="chat-code-lang">{match[1]}</span>
                  <button className="chat-code-copy" onClick={() => copyCode(code, currentIdx)}>
                    {copiedBlock === currentIdx ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0 0 10px 10px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    padding: '16px',
                    background: '#1a1b26',
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code className="chat-inline-code" {...props}>
              {children}
            </code>
          );
        },
        // Tables
        table({ children }) {
          return (
            <div className="chat-table-wrap">
              <table className="chat-table">{children}</table>
            </div>
          );
        },
        // Links
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="chat-link">
              {children}
            </a>
          );
        },
        // Lists
        ul({ children }) { return <ul className="chat-ul">{children}</ul>; },
        ol({ children }) { return <ol className="chat-ol">{children}</ol>; },
        li({ children }) { return <li className="chat-li">{children}</li>; },
        // Headings
        h1({ children }) { return <h3 className="chat-heading chat-h1">{children}</h3>; },
        h2({ children }) { return <h4 className="chat-heading chat-h2">{children}</h4>; },
        h3({ children }) { return <h5 className="chat-heading chat-h3">{children}</h5>; },
        // Blockquotes
        blockquote({ children }) {
          return <blockquote className="chat-blockquote">{children}</blockquote>;
        },
        // Paragraphs
        p({ children }) { return <p className="chat-p">{children}</p>; },
        // Horizontal rules
        hr() { return <hr className="chat-hr" />; },
        // Strong/Bold
        strong({ children }) { return <strong className="chat-strong">{children}</strong>; },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ─────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="chat-typing"
    >
      <div className="chat-typing-dots">
        <span style={{ animationDelay: '0ms' }} />
        <span style={{ animationDelay: '150ms' }} />
        <span style={{ animationDelay: '300ms' }} />
      </div>
      <span className="chat-typing-label">Thinking...</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Chat Page
// ─────────────────────────────────────────────
export default function PublicChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  const [agentConfig, setAgentConfig] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: string; content: string; timestamp?: Date }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [copiedMsg, setCopiedMsg] = useState<number | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showLeadGate, setShowLeadGate] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '' });
  const [submittingLead, setSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load agent
  useEffect(() => {
    // Generate session ID
    setSessionId(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

    fetch(`/api/agents/${agentId}`)
      .then(res => res.json())
      .then(res => {
        const agent = res.data || res;
        if (res.error || !agent || !agent.name) {
          setError('Agent not found or unavailable.');
        } else {
          setAgentConfig(agent);
          
          // Check lead capture gate
          if (agent.leadCaptureEnabled) {
            const hasSubmitted = localStorage.getItem(`lead_captured_${agentId}`);
            if (!hasSubmitted) {
              setShowLeadGate(true);
            }
          }

          const greeting = agent.systemPrompt
            ? `Hello! I'm **${agent.name}**. ${agent.description || ''}\n\nHow can I help you today?`
            : `Hello! I'm **${agent.name}**. How can I help you today?`;
          setMessages([{ role: 'assistant', content: greeting, timestamp: new Date() }]);
        }
      })
      .catch(() => setError('Failed to load agent.'))
      .finally(() => setIsLoading(false));
  }, [agentId]);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  // Detect scroll position
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const fromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollBtn(fromBottom > 200);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  // Copy message
  const copyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedMsg(idx);
    setTimeout(() => setCopiedMsg(null), 2000);
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input.trim(), timestamp: new Date() };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content })),
          systemPrompt: agentConfig?.systemPrompt || 'You are a helpful assistant.',
          model: agentConfig?.model || 'llama3.2',
          temperature: agentConfig?.temperature ?? 0.7,
          agentId,
          sessionId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        const isNoCredits = data.code === 'NO_CREDITS';
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: isNoCredits 
            ? `> 🔒 **Credits Depleted**\n>\n> The agent owner has run out of credits for this month. Please contact them to upgrade their plan or purchase additional credits.`
            : `> ⚠️ **Error**\n>\n> ${data.error}`,
          timestamp: new Date(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '> ⚠️ **Connection Error**\n>\n> Failed to reach the server. Please check your connection and try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  // Reset conversation
  const handleReset = () => {
    if (!agentConfig) return;
    setSessionId(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    const greeting = `Hello! I'm **${agentConfig.name}**. ${agentConfig.description || ''}\n\nHow can I help you today?`;
    setMessages([{ role: 'assistant', content: greeting, timestamp: new Date() }]);
  };

  // Lead Submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return;
    
    setSubmittingLead(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          ...leadForm
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(`lead_captured_${agentId}`, 'true');
        setShowLeadGate(false);
      } else {
        alert(data.error || 'Failed to submit info');
      }
    } catch {
      alert('Connection error');
    } finally {
      setSubmittingLead(false);
    }
  };

  // Key handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time
  const formatTime = (d?: Date) => {
    if (!d) return '';
    return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ─── Loading State ───
  if (isLoading) {
    return (
      <div className="chat-page-loading">
        <div className="chat-loading-pulse">
          <Sparkles size={28} />
        </div>
        <p>Loading agent...</p>
      </div>
    );
  }

  // ─── Error State ───
  if (error) {
    return (
      <div className="chat-page-loading">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😵</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Agent Unavailable</h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="chat-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative' }}>

      {/* ─── Header ─── */}
      <header className="chat-header" style={{ height: '72px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-card)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', zIndex: 50, flexShrink: 0 }}>
        <div className="chat-header-inner" style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="chat-header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="chat-header-avatar" style={{ width: '40px', height: '40px', borderRadius: '12px', background: agentConfig?.color || 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
              {agentConfig?.customLogo ? (
                <img src={agentConfig.customLogo} alt={agentConfig.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '18px' }}>{agentConfig?.icon || '🤖'}</span>
              )}
            </div>
            <div>
              <h1 className="chat-header-name" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{agentConfig?.name}</h1>
              <div className="chat-header-status" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: agentConfig?.color || 'var(--accent-green)', boxShadow: `0 0 6px ${agentConfig?.color || 'var(--accent-green)'}` }}></span>
                <span>Online</span>
                {agentConfig?.model && (
                  <>
                    <span style={{ color: 'var(--border-secondary)' }}>·</span>
                    <Zap size={10} />
                    <span>{agentConfig.model}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="chat-header-actions" style={{ display: 'flex', gap: '8px' }}>
            <ThemeToggle />
            <button className="chat-header-btn" onClick={handleReset} title="New conversation" style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-primary)', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Messages ─── */}
      <div className="chat-messages" ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', position: 'relative' }}>
        <div className="chat-messages-inner" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i === messages.length - 1 ? 0 : 0.1 }}
              style={{ display: 'flex', gap: '16px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}
            >
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: msg.role === 'user' ? 'var(--bg-tertiary)' : (agentConfig?.color || 'var(--gradient-primary)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '18px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border-primary)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {msg.role === 'user' ? (
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>USR</span>
                ) : (
                  agentConfig?.customLogo ? (
                    <img src={agentConfig.customLogo} alt={agentConfig.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'white' }}>{agentConfig?.icon || '🤖'}</span>
                  )
                )}
                {msg.role !== 'user' && !agentConfig?.customLogo && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 2s infinite' }}></div>
                )}
              </motion.div>

              <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '18px 24px',
                  borderRadius: msg.role === 'user' ? '24px 6px 24px 24px' : '6px 24px 24px 24px',
                  background: msg.role === 'user'
                    ? (agentConfig?.color || '#1e293b')
                    : 'rgba(var(--bg-primary-rgb), 0.6)',
                  color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                  border: msg.role === 'user' ? `1px solid ${agentConfig?.color || 'rgba(255,255,255,0.1)'}` : '1px solid var(--border-primary)',
                  boxShadow: msg.role === 'user'
                    ? `0 20px 40px -10px ${agentConfig?.color ? agentConfig.color + '44' : 'rgba(0,0,0,0.3)'}, inset 0 1px 1px rgba(255,255,255,0.1)`
                    : '0 10px 25px -5px rgba(0,0,0,0.05), var(--shadow-sm)',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  backdropFilter: 'blur(12px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {msg.role === 'user' && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}></div>
                  )}
                  {msg.role === 'assistant' ? (
                    <div className="chat-markdown">
                      <MarkdownContent content={msg.content} />
                    </div>
                  ) : (
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontWeight: 500, letterSpacing: '0.01em' }}>{msg.content}</p>
                  )}
                </div>

                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '14px', opacity: 0.5, fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} />
                    {formatTime(msg.timestamp)}
                  </span>
                  {msg.role === 'assistant' && i > 0 && (
                    <motion.button
                      whileHover={{ color: 'var(--text-primary)', scale: 1.05 }}
                      onClick={() => copyMessage(msg.content, i)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    >
                      {copiedMsg === i ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: agentConfig?.color || 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {agentConfig?.customLogo ? (
                    <img src={agentConfig.customLogo} alt={agentConfig.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '16px' }}>{agentConfig?.icon || '🤖'}</span>
                  )}
                </div>
                <TypingIndicator />
              </div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="chat-scroll-btn"
            onClick={scrollToBottom}
            style={{ position: 'absolute', bottom: '120px', right: '40px', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', cursor: 'pointer', zIndex: 10 }}
          >
            <ChevronDown size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Input Area ─── */}
      <div className="chat-input-area" style={{ padding: '20px 24px', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
        <div className="chat-input-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="chat-input-box" style={{ display: 'flex', gap: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '8px 12px', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${agentConfig?.name || 'Agent'}...`}
              rows={1}
              disabled={isTyping}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px', resize: 'none', padding: '8px 4px', maxHeight: '160px' }}
            />
             <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{ 
                padding: '8px', 
                borderRadius: '10px', 
                background: input.trim() && !isTyping ? (agentConfig?.color || 'var(--text-primary)') : 'transparent', 
                color: input.trim() && !isTyping ? 'white' : 'var(--text-muted)', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex' 
              }}
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          {!agentConfig?.whiteLabelEnabled && (
            <p className="chat-disclaimer" style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
              Powered by <strong>NexAgeAI</strong> · Intelligent Enterprise Orchestration
            </p>
          )}
        </div>
      </div>
      {/* ─── Lead Gate Overlay ─── */}
      <AnimatePresence>
        {showLeadGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(var(--bg-primary-rgb), 0.8)', backdropFilter: 'blur(10px)', 
              zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' 
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ 
                background: 'var(--bg-card)', border: '1px solid var(--border-primary)', 
                borderRadius: '24px', padding: '40px', maxWidth: '450px', width: '100%', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: agentConfig?.color || 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', fontSize: '28px', overflow: 'hidden' }}>
                  {agentConfig?.customLogo ? (
                    <img src={agentConfig.customLogo} alt={agentConfig.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    agentConfig?.icon || '🤖'
                  )}
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Ready to chat?</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Please provide your details to start the conversation with <strong>{agentConfig?.name}</strong>.</p>
              </div>

              <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</label>
                  <input 
                    type="text" required placeholder="John Doe"
                    value={leadForm.name}
                    onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                    style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Work Email</label>
                  <input 
                    type="email" required placeholder="john@company.com"
                    value={leadForm.email}
                    onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                    style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Company (Optional)</label>
                  <input 
                    type="text" placeholder="Acme Inc."
                    value={leadForm.company}
                    onChange={e => setLeadForm({...leadForm, company: e.target.value})}
                    style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                 <button 
                  type="submit" 
                  disabled={submittingLead}
                  style={{ 
                    marginTop: '12px', padding: '14px', borderRadius: '12px', background: agentConfig?.color || 'var(--text-primary)', 
                    color: 'white', border: 'none', fontWeight: 700, fontSize: '15px', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
                  }}
                >
                  {submittingLead ? <><Loader2 size={18} className="animate-spin" /> Starting...</> : 'Start Chatting'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  By clicking "Start Chatting", you agree to be contacted by the agent owner.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
