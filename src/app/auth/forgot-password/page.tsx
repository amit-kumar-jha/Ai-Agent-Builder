'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bot, Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Copy, ExternalLink, ShieldCheck, Key, Lock, Sparkles } from 'lucide-react';
import { forgotPasswordAction } from '@/actions/password';
import { motion, AnimatePresence } from 'framer-motion';

const securityFeatures = [
  { icon: <ShieldCheck size={18} />, text: 'Multi-factor authentication ready' },
  { icon: <Key size={18} />, text: 'End-to-end encrypted recovery' },
  { icon: <Lock size={18} />, text: 'Secure session management' }
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);

      const res = await forgotPasswordAction(formData);

      if (res.error) {
        throw new Error(res.error);
      }

      setSuccess(true);
      if (res.resetUrl) {
        setResetUrl(res.resetUrl);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyResetLink = () => {
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.2fr 1fr', background: 'var(--bg-primary)' }}>
      
      {/* Left Side: Immersive Info */}
      <div style={{ position: 'relative', background: 'var(--bg-secondary)', overflow: 'hidden', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border-primary)' }}>
        {/* Animated Background: Floating Cubes/Geometry */}
        <motion.div
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', border: '1px solid var(--border-primary)', opacity: 0.05, borderRadius: '100px' }}
        />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', cursor: 'pointer' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src="/logo.png" alt="NexAgeAI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>NexAgeAI</span>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(52, 211, 153, 0.1)', color: 'var(--accent-green)', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.05em' }}
          >
            <ShieldCheck size={14} /> SECURITY PROTOCOL ENABLED
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px', color: 'var(--text-primary)' }}
          >
            Securing your <br /> <span style={{ color: 'var(--accent-green)' }}>Digital Identity.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '48px' }}
          >
            We use multi-layer verification to ensure your AI infrastructure remains under your control, no matter what.
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {securityFeatures.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-primary)' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}>
                  {feature.icon}
                </div>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Reset Form */}
      <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {!success ? (
            <>
              <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Forgot Password</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Enter your email to receive a recovery link</p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '12px', color: 'var(--accent-red)', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.2s' }}
                      className="focus-ring"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '14px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '12px', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <>Send Reset Link <ArrowRight size={18} /></>}
                </button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle2 size={32} color="var(--accent-green)" />
                </div>
                <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Check Email</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
                  If an account exists for <strong>{email}</strong>, we've sent a recovery link.
                </p>
              </div>

              {resetUrl && (
                <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-primary)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-amber)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Dev Preview Link
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={copyResetLink} style={{ flex: 1, padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
                    </button>
                    <Link href={resetUrl.replace(/^https?:\/\/[^/]+/, '')} style={{ flex: 1 }}>
                      <button style={{ width: '100%', padding: '12px', background: 'var(--accent-purple)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <ExternalLink size={14} /> Open
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setSuccess(false); setEmail(''); setResetUrl(''); }}
                style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px' }}
              >
                Try another email
              </button>
            </motion.div>
          )}

          <div style={{ marginTop: '32px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ArrowLeft size={16} color="var(--text-muted)" />
            <Link href="/auth/signin" style={{ color: 'var(--accent-cyan)', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Back to Sign In</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

