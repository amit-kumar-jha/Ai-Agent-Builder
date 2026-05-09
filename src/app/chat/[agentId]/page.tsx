'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Bot, Send, Loader2, RotateCcw, Copy, Check, Sparkles, ChevronDown, Settings2, Zap } from 'lucide-react';
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load agent
  useEffect(() => {
    fetch(`/api/agents/${agentId}`)
      .then(res => res.json())
      .then(res => {
        const agent = res.data || res;
        if (res.error || !agent || !agent.name) {
          setError('Agent not found or unavailable.');
        } else {
          setAgentConfig(agent);
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
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `> ⚠️ **Error**\n>\n> ${data.error}`,
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
    const greeting = `Hello! I'm **${agentConfig.name}**. ${agentConfig.description || ''}\n\nHow can I help you today?`;
    setMessages([{ role: 'assistant', content: greeting, timestamp: new Date() }]);
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
    <div className="chat-page">

      {/* ─── Header ─── */}
      <header className="chat-header">
        <div className="chat-header-inner">
          <div className="chat-header-left">
            <div className="chat-header-avatar" style={{ background: agentConfig?.color || 'var(--gradient-primary)' }}>
              <span style={{ fontSize: '18px' }}>{agentConfig?.icon || '🤖'}</span>
            </div>
            <div>
              <h1 className="chat-header-name">{agentConfig?.name}</h1>
              <div className="chat-header-status">
                <span className="chat-status-dot" />
                <span>Online</span>
                {agentConfig?.model && (
                  <>
                    <span className="chat-header-sep">·</span>
                    <Zap size={10} />
                    <span>{agentConfig.model}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="chat-header-actions">
            <ThemeToggle />
            <button className="chat-header-btn" onClick={handleReset} title="New conversation">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Messages ─── */}
      <div className="chat-messages" ref={chatContainerRef}>
        <div className="chat-messages-inner">

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
            >
              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div className="chat-avatar chat-avatar-ai" style={{ background: agentConfig?.color || 'var(--gradient-primary)' }}>
                  <span style={{ fontSize: '16px' }}>{agentConfig?.icon || '🤖'}</span>
                </div>
              )}

              <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                {msg.role === 'assistant' ? (
                  <div className="chat-markdown">
                    <MarkdownContent content={msg.content} />
                  </div>
                ) : (
                  <p className="chat-user-text">{msg.content}</p>
                )}

                {/* Message footer */}
                <div className="chat-bubble-footer">
                  <span className="chat-timestamp">{formatTime(msg.timestamp)}</span>
                  {msg.role === 'assistant' && i > 0 && (
                    <button className="chat-copy-btn" onClick={() => copyMessage(msg.content, i)}>
                      {copiedMsg === i ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                    </button>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="chat-avatar chat-avatar-user">U</div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <div className="chat-message chat-message-assistant">
                <div className="chat-avatar chat-avatar-ai" style={{ background: agentConfig?.color || 'var(--gradient-primary)' }}>
                  <span style={{ fontSize: '16px' }}>{agentConfig?.icon || '🤖'}</span>
                </div>
                <TypingIndicator />
              </div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="chat-scroll-btn"
            onClick={scrollToBottom}
          >
            <ChevronDown size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Input Area ─── */}
      <div className="chat-input-area">
        <div className="chat-input-container">
          <div className="chat-input-box">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${agentConfig?.name || 'Agent'}...`}
              rows={1}
              disabled={isTyping}
              className="chat-textarea"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`chat-send-btn ${input.trim() && !isTyping ? 'chat-send-active' : ''}`}
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="chat-disclaimer">
            Powered by <strong>NexAgeAI</strong> · AI responses may be inaccurate
          </p>
        </div>
      </div>
    </div>
  );
}
