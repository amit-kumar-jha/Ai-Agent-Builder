'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Zap, Shield, Cpu, ArrowRight, Layout, Database, Rocket, DollarSign, CheckCircle2, Server, Key, BrainCircuit, BarChart3, Globe, MessageSquare, Workflow, MessageCircle, Webhook, Terminal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';

const fadeIn: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('support');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('agentos_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signin');
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'background-color 0.3s ease, color 0.3s ease', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'var(--bg-card)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-primary)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/logo.png" alt="NexAgeAI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>NexAgeAI</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>Features</a>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>How it Works</a>
          <a href="#use-cases" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>Use Cases</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>Pricing</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }} onClick={() => router.push('/auth/signin')}>Sign In</button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} 
            onClick={handleCtaClick}
          >
            Start Building <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '180px', paddingBottom: '80px', textAlign: 'center', paddingLeft: '24px', paddingRight: '24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px', background: 'var(--gradient-glow)', filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none', opacity: 0.5 }}></div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div variants={fadeIn} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '999px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '32px' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent-green)', borderRadius: '50%', display: 'inline-block' }}></span>
            NexAgeAI is now available
          </motion.div>

          <motion.h1 variants={fadeIn} style={{ fontSize: '76px', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 1.05, color: 'var(--text-primary)' }}>
            Build AI Agents <br />
            That Work For You.
          </motion.h1>

          <motion.p variants={fadeIn} style={{ fontSize: '22px', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '640px', margin: '0 auto 48px', lineHeight: 1.5, fontWeight: 400, letterSpacing: '-0.01em' }}>
            The minimalist, enterprise-grade platform to design, customize, and deploy intelligent agents across any channel in minutes.
          </motion.p>

          <motion.div variants={fadeIn} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer' }} 
              onClick={handleCtaClick}
            >
              Create Agent Free
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'transparent', color: 'var(--text-primary)', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, border: '1px solid var(--border-secondary)', cursor: 'pointer' }} 
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Documentation
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Product Demo / Interactive Preview */}
      <section id="demo" style={{ padding: '40px 24px 120px', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any}
          style={{ maxWidth: '1000px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}
        >
          {/* Mock Browser/App Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 24px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
            </div>
            <div style={{ margin: '0 auto', fontSize: '13px', fontWeight: 500, color: 'var(--text-tertiary)', background: 'var(--bg-input)', padding: '4px 120px', borderRadius: '6px' }}>
              agentos.io/builder/sales-assistant
            </div>
          </div>

          {/* Mock App Body */}
          <div style={{ display: 'flex', height: '500px' }}>
            {/* Sidebar */}
            <div style={{ width: '240px', borderRight: '1px solid var(--border-primary)', padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Configuration</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '10px 14px', background: 'var(--bg-input-focus)', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', border: '1px solid var(--border-focus)' }}>System Prompt</div>
                <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Knowledge Base</div>
                <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Tools & APIs</div>
                <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Deployment Channels</div>
              </div>
            </div>
            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Sales Assistant Agent</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Define the core behavior and identity of your agent.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Instructions</label>
                <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)', borderRadius: '12px', padding: '16px', fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.6, height: '120px' }}>
                  You are an expert sales development representative for Acme Corp. Your goal is to qualify leads and schedule demos. Be polite, concise, and always push gently for a meeting. Use the Stripe tool to verify customer status before offering discounts.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Model Selection</label>
                  <div style={{ padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                    GPT-4o (Optimized) <ArrowRight size={16} color="var(--text-tertiary)" />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Active Tools</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ padding: '6px 12px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>Stripe API</div>
                    <div style={{ padding: '6px 12px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>HubSpot</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>Test in Sandbox</button>
                <button style={{ padding: '10px 20px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>Deploy to Slack</button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '120px 48px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>From concept to production.</h2>
            <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.5 }}>Three steps to build intelligent automation that scales with your business.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div style={{ fontSize: '48px', fontWeight: 300, color: 'var(--border-secondary)', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>01</div>
              <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Create Agent</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>Start with a natural language prompt or drag-and-drop workflow nodes. Define the persona, core instructions, and boundaries.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div style={{ fontSize: '48px', fontWeight: 300, color: 'var(--border-secondary)', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>02</div>
              <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Customize Logic</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>Give your agent short and long-term memory. Connect it to external tools, databases, and your proprietary knowledge base.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <div style={{ fontSize: '48px', fontWeight: 300, color: 'var(--border-secondary)', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>03</div>
              <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Deploy Anywhere</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>Push to production with a single click. Embed on your website, integrate into Slack, or access via secure REST APIs.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '120px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '60px', textAlign: 'center' }}>Enterprise Capabilities</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            { icon: <Workflow size={24} />, title: 'Visual & Prompt Builder', desc: 'Design complex agentic reasoning loops visually, or just describe what you need in plain text.' },
            { icon: <Database size={24} />, title: 'Advanced Memory Context', desc: 'State-of-the-art vector storage gives your agents perfect recall of past interactions and documents.' },
            { icon: <Webhook size={24} />, title: 'Deep Integrations', desc: 'Native connections to Slack, Discord, Zendesk, Salesforce, and custom Webhooks out of the box.' },
            { icon: <Cpu size={24} />, title: 'Multi-Model Routing', desc: 'Dynamically route tasks between OpenAI, Anthropic, or your private local Ollama models based on cost and complexity.' },
            { icon: <BarChart3 size={24} />, title: 'Analytics & Logs', desc: 'Complete observability. Monitor token usage, trace execution paths, and debug tool calls in real-time.' },
            { icon: <Terminal size={24} />, title: 'API-First Architecture', desc: 'Everything you can do in the UI can be managed programmatically via our secure, versioned REST API.' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ padding: '32px', border: '1px solid var(--border-primary)', borderRadius: '16px', background: 'var(--bg-card)' }}
            >
              <div style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" style={{ padding: '120px 48px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '40px', textAlign: 'center' }}>Built for any workflow.</h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
            {['support', 'sales', 'internal'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '999px',
                  fontSize: '15px',
                  fontWeight: 600,
                  background: activeTab === tab ? 'var(--text-primary)' : 'transparent',
                  color: activeTab === tab ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: activeTab === tab ? 'none' : '1px solid var(--border-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'support' && 'Customer Support'}
                {tab === 'sales' && 'Sales Assistants'}
                {tab === 'internal' && 'Internal Automation'}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '24px', padding: '48px', minHeight: '300px' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'support' && (
                <motion.div key="support" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Level 1 Support, Fully Automated.</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>Train an agent on your Help Center articles and Zendesk history. Deploy it as a website widget to instantly resolve 70% of inbound queries, only escalating complex issues to human agents.</p>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>
                        <MessageSquare size={18} /> Embeddable Web Widget
                      </div>
                    </div>
                    <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '16px', height: '240px', border: '1px solid var(--border-primary)' }}></div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'sales' && (
                <motion.div key="sales" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Outbound at Scale.</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>Connect an agent to your CRM. Have it automatically research prospects, draft hyper-personalized emails, and qualify inbound leads 24/7 without ever taking a break.</p>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>
                        <Database size={18} /> Salesforce & Hubspot Ready
                      </div>
                    </div>
                    <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '16px', height: '240px', border: '1px solid var(--border-primary)' }}></div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'internal' && (
                <motion.div key="internal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Your Company Brain in Slack.</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>Deploy an internal IT or HR assistant directly into your company's Slack workspace. Employees can ask for policies, request software access, or query internal databases securely.</p>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>
                        <MessageCircle size={18} /> Native Slack App Integration
                      </div>
                    </div>
                    <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '16px', height: '240px', border: '1px solid var(--border-primary)' }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '120px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>Simple, transparent pricing.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Start for free, upgrade when you need scale.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
        >
          {/* Free */}
          <motion.div 
            variants={fadeIn}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            style={{ padding: '40px', border: '1px solid var(--border-primary)', borderRadius: '24px', background: 'var(--bg-card)' }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Developer</h3>
            <div style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '24px' }}>$0<span style={{ fontSize: '16px', color: 'var(--text-tertiary)', fontWeight: 400 }}>/mo</span></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Perfect for prototyping and personal projects.</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--border-secondary)', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px', cursor: 'pointer' }}>Start Free</motion.button>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}><Check size={16} /> 2 Active Agents</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}><Check size={16} /> Basic LLM Support</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}><Check size={16} /> Web Widget Deploy</li>
            </ul>
          </motion.div>

          {/* Pro */}
          <motion.div 
            variants={fadeIn}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            style={{ padding: '40px', border: '2px solid var(--text-primary)', borderRadius: '24px', background: 'var(--bg-primary)', position: 'relative' }}
          >
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>Most Popular</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Pro</h3>
            <div style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '24px' }}>$49<span style={{ fontSize: '16px', color: 'var(--text-tertiary)', fontWeight: 400 }}>/mo</span></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>For startups scaling their AI automation.</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%', padding: '12px', background: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--bg-primary)', marginBottom: '32px', cursor: 'pointer' }}>Upgrade to Pro</motion.button>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}><Check size={16} /> Unlimited Agents</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}><Check size={16} /> GPT-4 & Claude 3</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}><Check size={16} /> Slack & API Integrations</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}><Check size={16} /> Advanced Analytics</li>
            </ul>
          </motion.div>

          {/* Enterprise */}
          <motion.div 
            variants={fadeIn}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            style={{ padding: '40px', border: '1px solid var(--border-primary)', borderRadius: '24px', background: 'var(--bg-card)' }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Enterprise</h3>
            <div style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '24px' }}>Custom</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Custom infrastructure for large organizations.</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--border-secondary)', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px', cursor: 'pointer' }}>Contact Sales</motion.button>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}><Check size={16} /> Dedicated VPC Deployment</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}><Check size={16} /> Local Models Support</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}><Check size={16} /> SOC2 & GDPR Compliance</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}><Check size={16} /> 24/7 SLA Support</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ marginTop: 'auto', borderTop: '1px solid var(--border-primary)', padding: '60px 48px', background: 'var(--bg-primary)' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <img src="/logo.png" alt="NexAgeAI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>NexAgeAI</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, maxWidth: '240px' }}>
              The infrastructure for the agentic web. Build, deploy, and scale AI faster.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Product</h4>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Builder</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Integrations</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Pricing</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Changelog</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Resources</h4>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Documentation</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>API Reference</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Blog</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Community</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Legal</h4>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Security</a>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '60px auto 0', borderTop: '1px solid var(--border-primary)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>© 2026 NexAgeAI Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Social icons could go here */}
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>All systems operational</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
