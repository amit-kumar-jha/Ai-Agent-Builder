'use client';
// Force rebuild - 2026-05-10-22-45
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Zap, Shield, Cpu, ArrowRight, Layout, Database, Rocket, DollarSign, CheckCircle2, Server, Key, BrainCircuit, BarChart3, Globe, MessageSquare, Workflow, MessageCircle, Webhook, Terminal, Check, Link2, SlidersHorizontal, Save, Play, Plus } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { Background3D, Grid3D } from '@/components/landing/Background3D';
import { FloatingBackgroundIcons } from '@/components/landing/FloatingIcons';
import { Magnetic } from '@/components/ui/Magnetic';
import { AnimatedBeam } from '@/components/landing/Beam';
import { CursorFollower } from '@/components/ui/CursorFollower';
import { BackgroundGrain } from '@/components/ui/BackgroundGrain';

const fadeIn: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const slideInLeft: any = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const slideInRight: any = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function FAQItem({ item, index }: { item: any, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.01, y: -4 }}
      style={{
        border: '1px solid var(--border-primary)',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div style={{ padding: '32px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{item.q}</h3>
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0, scale: isOpen ? 1.2 : 1, color: isOpen ? 'var(--accent-purple)' : 'var(--text-tertiary)' }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Plus size={24} />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '17px',
                  lineHeight: 1.7,
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '24px'
                }}
              >
                {item.a}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Background Glow */}
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 100%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
}

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const skew = useTransform(scrollVelocity, [-0.5, 0.5], [-5, 5]);
  const skewSpring = useSpring(skew, { stiffness: 100, damping: 30 });

  if (!mounted) return null;

  const textReveal: any = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  const SplitText = ({ text, style }: { text: string; style?: React.CSSProperties }) => {
    return (
      <span style={{ display: 'inline-block', overflow: 'hidden', ...style }}>
        {text.split(' ').map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={textReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'background-color 0.3s ease, color 0.3s ease', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>

      <BackgroundGrain />
      <CursorFollower />
      <FloatingBackgroundIcons />

      {/* Scroll Progress Bar */}
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--gradient-primary)',
          transformOrigin: '0%',
          zIndex: 100
        }}
      />

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
          {[
            { name: 'Features', href: '#features' },
            { name: 'Integrations', href: '#integrations' },
            { name: 'Marketplace', href: '/marketplace' },
            { name: 'FAQ', href: '#faq' },
            { name: 'Pricing', href: '#pricing' }
          ].map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              whileHover={{ y: -2 }}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s', position: 'relative' }}
            >
              {link.name}
              <motion.span
                className="nav-underline"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                style={{ position: 'absolute', bottom: '-4px', left: 0, height: '2px', background: 'var(--text-primary)', borderRadius: '2px' }}
              />
            </motion.a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }} onClick={() => router.push('/auth/signin')}>Sign In</button>
          <Magnetic>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={handleCtaClick}
            >
              Start Building <ArrowRight size={14} />
            </motion.button>
          </Magnetic>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '180px', paddingBottom: '80px', textAlign: 'center', paddingLeft: '24px', paddingRight: '24px', position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Background3D />

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div variants={fadeIn} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '999px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '32px' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent-green)', borderRadius: '50%', display: 'inline-block' }}></span>
            NexAgeAI is now available
          </motion.div>

          <motion.h1 variants={fadeIn} style={{ fontSize: '76px', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 1.05, color: 'var(--text-primary)' }}>
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                background: 'linear-gradient(to right, var(--text-primary), var(--accent-purple), var(--text-primary))',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              <SplitText text="Build AI Agents" />
            </motion.span> <br />
            <SplitText text="That Work For You." />
          </motion.h1>

          <motion.p variants={fadeIn} style={{ fontSize: '22px', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '640px', margin: '0 auto 48px', lineHeight: 1.5, fontWeight: 400, letterSpacing: '-0.01em' }}>
            <SplitText text="The minimalist, enterprise-grade platform to design, customize, and deploy intelligent agents across any channel in minutes." />
          </motion.p>

          <motion.div variants={fadeIn} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                onClick={handleCtaClick}
              >
                Create Agent Free
              </motion.button>
            </Magnetic>
            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'transparent', color: 'var(--text-primary)', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, border: '1px solid var(--border-secondary)', cursor: 'pointer' }}
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </motion.button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof Metrics */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap', padding: '0 24px' }}>
          {[
            { value: '1,200+', label: 'Agents Created' },
            { value: '50K+', label: 'API Requests Served' },
            { value: '12', label: 'LLM Models Supported' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.02em' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content Wrapper with Skew Effect */}
      <motion.div style={{ skewY: skewSpring, transition: 'transform 0.1s ease-out' }}>

        {/* Product Demo / Interactive Preview */}
        <section id="demo" style={{ padding: '40px 24px 120px', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1 },
              scale: { duration: 1 }
            }}
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
                NexAgeAI/builder/sales-assistant
              </div>
            </div>

            {/* Mock App Body */}
            <div style={{ display: 'flex', minHeight: '520px' }}>
              {/* Sidebar Tabs - Aligned with actual code */}
              <div style={{ width: '240px', borderRight: '1px solid var(--border-primary)', padding: '24px', background: 'rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border-primary)' }}>
                    <MessageSquare size={16} color="var(--accent-purple)" /> Prompt
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Database size={16} /> Knowledge
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Terminal size={16} /> Tools
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <SlidersHorizontal size={16} /> Settings
                  </div>
                </div>
              </div>

              {/* Main Content - Aligned with actual code */}
              <div style={{ flex: 1, padding: '40px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Customer Support Bot</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>AI-powered support agent with multi-step reasoning.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ padding: '4px 12px', background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Save size={12} /> Save Agent
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>System Prompt</label>
                  <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.6, minHeight: '100px' }}>
                    You are a helpful customer support assistant for NexAgeAI. Always be polite and concise. If you don't know the answer, use the search tool.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: '8px' }}>Model Selection</label>
                    <div style={{ padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      llama3.2 <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', borderRadius: '4px' }}>RECOMMENDED</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: '8px' }}>Temperature</label>
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, height: '4px', background: 'var(--border-primary)', borderRadius: '2px', position: 'relative' }}>
                        <motion.div animate={{ left: '70%' }} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--accent-purple)', boxShadow: '0 0 15px var(--accent-purple)', cursor: 'pointer' }}></motion.div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-purple)' }}>0.7</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)' }}>ACTIVE TOOLS & CAPABILITIES</span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></div> SEARCH</span>
                      <span style={{ fontSize: '10px', color: 'var(--accent-amber)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-amber)' }}></div> CUSTOM_API</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['Web Search', 'File Reader', 'Calculator', 'Human Handoff', 'Stripe Integration'].map(tool => (
                      <div key={tool} style={{ padding: '6px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{tool}</div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                  <button style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>Discard Changes</button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ padding: '12px 32px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(255,255,255,0.1)' }}
                  >
                    <Play size={16} /> Deploy Agent
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Integrations Ecosystem - Orbit Animation */}
        <section id="integrations" style={{ padding: '120px 48px', overflow: 'hidden', position: 'relative', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '80px' }}>
            <div style={{ flex: 1 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <h2 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '24px' }}>Connect your tools. <br />Scale your intelligence.</h2>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>NexAgeAI natively integrates with the world's most popular platforms. Power your agents with real-time data from your entire tech stack.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {['Slack', 'Discord', 'Zendesk', 'Salesforce', 'Hubspot', 'Notion', 'GitHub', 'Linear'].map(tool => (
                    <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
                      {tool}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div style={{ flex: 1, position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '400px', height: '400px', border: '1px solid var(--border-primary)', borderRadius: '50%' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'var(--gradient-primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)' }}>
                  <Bot color="white" size={40} />
                </div>

                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', pointerEvents: 'none' }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${angle}deg)`,
                      transformOrigin: '50% 220px',
                      width: '44px',
                      height: '44px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      {i === 0 && <MessageCircle size={20} />}
                      {i === 1 && <Database size={20} />}
                      {i === 2 && <Globe size={20} />}
                      {i === 3 && <Terminal size={20} />}
                      {i === 4 && <Shield size={20} />}
                      {i === 5 && <Zap size={20} />}
                      {i === 6 && <BarChart3 size={20} />}
                      {i === 7 && <Layout size={20} />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Enterprise Walkthrough */}
        <section id="how-it-works" style={{ padding: '160px 48px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '100%', background: 'linear-gradient(to bottom, transparent, var(--border-primary), transparent)', opacity: 0.5 }}></div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              style={{ textAlign: 'center', marginBottom: '120px' }}
            >
              <h2 style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '24px' }}>From Concept to <span style={{ color: 'var(--accent-purple)' }}>Production.</span></h2>
              <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>A streamlined workflow designed for high-velocity engineering teams.</p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '160px', position: 'relative' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ flex: 1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}>01</div>
                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--accent-purple), transparent)' }}></div>
                  </div>
                  <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>Create Your Agent</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.6 }}>Start with a natural language prompt or use our visual DAG builder. Define the core persona, logic gates, and operational boundaries in seconds.</p>
                </motion.div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '24px', width: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                  >
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    </div>
                    <div style={{ background: 'var(--bg-input)', borderRadius: '8px', padding: '12px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
                      &gt; Define Agent: "LeadGenExpert" <br />
                      &gt; Goal: "Qualify 100+ daily leads" <br />
                      &gt; Persona: "Professional, Persistent"
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '80px' }}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ flex: 1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-cyan)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>02</div>
                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(270deg, var(--accent-cyan), transparent)' }}></div>
                  </div>
                  <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>Inject Intelligence</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.6 }}>Equip your agent with long-term memory and native tool access. Connect to your Slack, Salesforce, or custom DB to provide real-world context.</p>
                </motion.div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '24px', width: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                  >
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      {[1, 2, 3].map(i => <div key={i} style={{ width: '32px', height: '4px', background: 'var(--accent-cyan)', borderRadius: '2px', opacity: 0.3 }}></div>)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database size={20} color="var(--accent-cyan)" /></div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Connecting Vector DB...</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ flex: 1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', boxShadow: '0 0 20px rgba(52, 211, 153, 0.3)' }}>03</div>
                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--accent-green), transparent)' }}></div>
                  </div>
                  <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>Global Deployment</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.6 }}>Push to production with one click. Deploy as a web widget, a headless API service, or directly into your company's communication stack.</p>
                </motion.div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '24px', width: '400px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}
                    >
                      <Rocket size={32} />
                    </motion.div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-green)' }}>LIVE IN PRODUCTION</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Capabilities Section - Interactive Spotlight */}
        <section id="features" style={{ padding: '160px 48px', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
            <div style={{ flex: 1.2 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '999px', fontSize: '13px', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '24px' }}>
                  THE ENGINE
                </div>
                <h2 style={{ fontSize: '64px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 1.1 }}>Powering the next <br /><span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Generation of AI.</span></h2>
                <p style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '48px' }}>Move beyond simple chat. NexAgeAI provides the orchestration, memory, and security required for true production agents.</p>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {[
                  {
                    icon: <Workflow size={24} />,
                    title: 'Autonomous Workflows',
                    desc: 'Define complex goal-oriented tasks. Our engine handles pathfinding and tool execution.'
                  },
                  {
                    icon: <Database size={24} />,
                    title: 'Cross-Session Memory',
                    desc: 'Agents remember user preferences and past interactions across every touchpoint.'
                  },
                  {
                    icon: <Shield size={24} />,
                    title: 'Hardened Security',
                    desc: 'Military-grade encryption and isolated sandboxes for every agent execution.'
                  },
                  {
                    icon: <BarChart3 size={24} />,
                    title: 'Real-time Observability',
                    desc: 'Trace execution paths, monitor costs, and debug tool calls in a unified dashboard.'
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    whileHover={{ x: 10 }}
                    style={{ cursor: 'pointer', display: 'flex', gap: '24px', alignItems: 'flex-start' }}
                  >
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--accent-purple)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, position: 'relative', height: '600px' }}>
              {/* Visual Preview Area */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                style={{
                  height: '100%',
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  borderRadius: '32px',
                  border: '1px solid var(--border-primary)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 40px 100px -20px rgba(0,0,0,0.4)'
                }}
              >
                <Grid3D />

                {/* Floating UI Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    padding: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    width: '240px'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px' }}>SYSTEM_ORCHESTRATOR</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                      <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} style={{ height: '100%', background: 'var(--accent-cyan)', borderRadius: '2px' }} />
                    </div>
                    <div style={{ height: '4px', width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                    <div style={{ height: '4px', width: '90%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '10%',
                    padding: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    width: '200px'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '12px' }}>SECURE_ENCLAVE</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                        style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-purple)' }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Central Brain Icon */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '30px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 60px rgba(139, 92, 246, 0.4)',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <Cpu color="white" size={48} />
                </motion.div>

                {/* Pulsing Rings */}
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                    transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      width: '120px',
                      height: '120px',
                      borderRadius: '30px',
                      border: '1px solid var(--accent-purple)',
                      zIndex: 1
                    }}
                  />
                ))}
              </motion.div>
            </div>
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

            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '24px', padding: '48px', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
              <AnimatePresence mode="wait">
                {activeTab === 'support' && (
                  <motion.div key="support" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                      <div style={{ flex: 1.2 }}>
                        <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Level 1 Support, Fully Automated.</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>Train an agent on your Help Center articles and Zendesk history. Deploy it as a website widget to instantly resolve 70% of inbound queries, only escalating complex issues to human agents.</p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--accent-cyan)', fontSize: '14px', fontWeight: 600 }}>
                          <MessageSquare size={18} /> Embeddable Web Widget
                        </div>
                      </div>
                      <div style={{ flex: 1, position: 'relative', background: 'var(--bg-secondary)', borderRadius: '16px', height: '320px', border: '1px solid var(--border-primary)', padding: '20px', overflow: 'hidden' }}>
                        {/* Chat UI Mock */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '12px 12px 12px 2px', maxWidth: '80%', fontSize: '13px', border: '1px solid var(--border-primary)' }}>
                            Hi! I can't access my recent invoices. Can you help?
                          </motion.div>
                          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 }} style={{ background: 'var(--accent-purple)', color: 'white', padding: '10px 14px', borderRadius: '12px 12px 2px 12px', maxWidth: '80%', alignSelf: 'flex-end', fontSize: '13px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><Bot size={12} /> <strong>NexAge Agent</strong></div>
                            Sure! I've located your invoices. You can download the latest one below:
                          </motion.div>
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.8 }} style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '8px', border: '1px dashed var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-end', width: '70%', fontSize: '12px' }}>
                            <Database size={14} color="var(--accent-cyan)" /> invoice_may_2026.pdf
                          </motion.div>
                        </div>
                        {/* Floating decorative elements */}
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '8px 12px', background: 'rgba(52, 211, 153, 0.1)', color: 'var(--accent-green)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, border: '1px solid var(--accent-green)' }}>
                          78% RESOLVED
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'sales' && (
                  <motion.div key="sales" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                      <div style={{ flex: 1.2 }}>
                        <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Outbound at Scale.</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>Connect an agent to your CRM. Have it automatically research prospects, draft hyper-personalized emails, and qualify inbound leads 24/7 without ever taking a break.</p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--accent-purple)', fontSize: '14px', fontWeight: 600 }}>
                          <Database size={18} /> Salesforce & Hubspot Ready
                        </div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '16px', height: '320px', border: '1px solid var(--border-primary)', padding: '24px', overflow: 'hidden' }}>
                        {/* Sales Prospecting Mock */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {[
                            { name: "Alex Rivera", role: "CTO @ Vertex", status: "Personalizing..." },
                            { name: "Sarah Chen", role: "VP Ops @ Nexus", status: "Qualified" },
                            { name: "James Wilson", role: "Director @ Quantum", status: "Drafting" }
                          ].map((lead, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5 + (i * 0.2) }}
                              style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{lead.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{lead.role}</div>
                              </div>
                              <div style={{
                                fontSize: '10px',
                                padding: '4px 8px',
                                borderRadius: '999px',
                                background: lead.status === 'Qualified' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                color: lead.status === 'Qualified' ? 'var(--accent-green)' : 'var(--accent-purple)',
                                fontWeight: 700
                              }}>
                                {lead.status}
                              </div>
                            </motion.div>
                          ))}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', borderTop: '1px solid var(--border-primary)', paddingTop: '10px' }}
                          >
                            +24 more researched today
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'internal' && (
                  <motion.div key="internal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                      <div style={{ flex: 1.2 }}>
                        <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Your Company Brain in Slack.</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>Deploy an internal IT or HR assistant directly into your company's Slack workspace. Employees can ask for policies, request software access, or query internal databases securely.</p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--accent-green)', fontSize: '14px', fontWeight: 600 }}>
                          <MessageCircle size={18} /> Native Slack App Integration
                        </div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '16px', height: '320px', border: '1px solid var(--border-primary)', padding: '20px', overflow: 'hidden' }}>
                        {/* Slack UI Mock */}
                        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', height: '100%', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ padding: '10px', borderBottom: '1px solid var(--border-primary)', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }}></div> #internal-support
                          </div>
                          <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#e2e8f0' }}></div>
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>John <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, fontSize: '10px' }}>2:14 PM</span></div>
                                <div style={{ fontSize: '13px' }}>Hey @NexAge, what's our remote work policy?</div>
                              </div>
                            </div>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ display: 'flex', gap: '10px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Bot size={16} /></div>
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>NexAge <span style={{ padding: '1px 4px', background: '#edf2f7', color: '#4a5568', borderRadius: '3px', fontSize: '9px' }}>APP</span></div>
                                <div style={{ fontSize: '13px', lineHeight: 1.4 }}>According to the 2026 Handbook, you can work remotely up to 3 days per week. You can find the full document here:</div>
                                <div style={{ marginTop: '8px', padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Link2 size={12} /> employee_handbook_v4.pdf
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" style={{ padding: '120px 48px', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '80px' }}>
            <div style={{ flex: 1 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <h2 style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 1.1 }}>Everything you <br />need to know.</h2>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>Can't find the answer you're looking for? Reach out to our technical support team for detailed architecture consultations.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '14px 28px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Contact Support
                </motion.button>
              </motion.div>
            </div>

            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  q: "How secure is the data passed to agents?",
                  a: "We implement SOC2-compliant security protocols. All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Agents operate in isolated sandboxes with zero-retention policies for sensitive training data."
                },
                {
                  q: "Can I use my own private LLMs?",
                  a: "Absolutely. NexAgeAI is model-agnostic. You can route workflows through our secure gateway to your private instances of Llama 3, Mistral, or custom fine-tuned models hosted on your VPC."
                },
                {
                  q: "What deployment channels are supported?",
                  a: "Deploy instantly via our React/Next.js SDK, REST API, or native integrations. We support Slack, Discord, MS Teams, Zendesk, and even custom hardware interfaces via Webhooks."
                },
                {
                  q: "Is there a limit on agent complexity?",
                  a: "Our DAG-based orchestration engine is built for scale. Agents can handle recursive loops, multi-agent collaboration (Swarm), and parallel tool execution with sub-second latency."
                },
                {
                  q: "How does the memory system work?",
                  a: "We use a hybrid RAG approach combining vector embeddings for semantic retrieval and a structured 'scratchpad' memory for long-term state persistence across sessions."
                }
              ].map((item, i) => (
                <FAQItem key={i} item={item} index={i} />
              ))}
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
              variants={scaleIn}
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
              variants={scaleIn}
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
              variants={scaleIn}
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

        {/* Final CTA Banner */}
        <section style={{ padding: '120px 48px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              background: 'var(--gradient-primary)',
              borderRadius: '32px',
              padding: '80px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)'
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '48px', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', marginBottom: '24px' }}>Ready to build the future of agentic web?</h2>
              <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>Join thousands of developers building intelligent, autonomous agents on NexAgeAI.</p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Magnetic>
                  <button onClick={handleCtaClick} style={{ padding: '18px 36px', background: 'white', color: 'var(--accent-purple)', borderRadius: '12px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Get Started for Free</button>
                </Magnetic>
                <Magnetic>
                  <button style={{ padding: '18px 36px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '12px', fontSize: '16px', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>Schedule a Demo</button>
                </Magnetic>
              </div>
            </div>
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          </motion.div>
        </section>

      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginTop: 'auto', borderTop: '1px solid var(--border-primary)', padding: '120px 48px 60px', background: 'rgba(255, 255, 255, 0.03)', position: 'relative', overflow: 'hidden' }}
      >
        {/* Abstract Background Accents */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid var(--border-primary)', paddingBottom: '80px', marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.02em' }}>Stay ahead of the agentic wave.</h4>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Get the latest research on autonomous workflows and platform updates.</p>
          </div>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{ width: '100%', padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', fontSize: '15px', color: 'var(--text-primary)', outline: 'none', transition: 'all 0.3s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-purple)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-primary)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)';
                }}
              />
              <motion.button
                whileHover={{ scale: 1.02, x: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ position: 'absolute', right: '8px', padding: '10px 24px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '60px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
                <img src="/logo.png" alt="NexAgeAI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em' }}>NexAgeAI</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, maxWidth: '280px', marginBottom: '32px' }}>
              Architecting the future of the agentic web. Build, deploy, and scale autonomous AI workflows with military-grade precision.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[Globe, MessageCircle, Link2].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, color: 'var(--accent-purple)' }}
                  style={{ color: 'var(--text-primary)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {[
            {
              title: 'Product',
              links: ['Agent Builder', 'Knowledge Base', 'Tool Library', 'API Reference', 'Integrations']
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Blog', 'Changelog', 'Security']
            },
            {
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/privacy#cookies' },
                { label: 'SLA', href: '/terms#sla' },
              ]
            }
          ].map((column, i) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{column.title}</h4>
              {column.links.map((link: any) => {
                const label = typeof link === 'string' ? link : link.label;
                const href = typeof link === 'string' ? '#' : link.href;
                return (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ x: 6, color: 'var(--text-primary)' }}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'all 0.2s ease' }}
                  >
                    {label}
                  </motion.a>
                );
              })}
            </motion.div>
          ))}
        </div>

        <div style={{ maxWidth: '1200px', margin: '80px auto 0', borderTop: '1px solid var(--border-primary)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>© 2026 NexAgeAI Inc.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(52, 211, 153, 0.05)', borderRadius: '999px', border: '1px solid rgba(52, 211, 153, 0.1)' }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)' }}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-green)' }}>SYSTEMS OPERATIONAL</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/privacy" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '13px' }}>Privacy</a>
            <a href="/terms" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '13px' }}>Terms</a>
            <a href="/privacy#cookies" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '13px' }}>Cookies</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
