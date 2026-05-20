'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useStore from '@/lib/store';
import { Bot, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import { signInAction } from '@/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';

const featureList = [
  { icon: <Zap size={18} />, text: 'Deploy agents in under 60 seconds' },
  { icon: <Shield size={18} />, text: 'Enterprise-grade security by default' },
  { icon: <Sparkles size={18} />, text: 'Access to 100+ state-of-the-art models' }
];

export default function SignInPage() {
  const router = useRouter();
  const { setAuth } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const res = await signInAction(formData);

      if (res.error) {
        throw new Error(res.error);
      }

      if (res.user) {
        setAuth(res.user, 'server-action');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.2fr 1fr', background: 'var(--bg-primary)' }}>
      
      {/* Left Side: Immersive Info */}
      <div style={{ position: 'relative', background: 'var(--bg-secondary)', overflow: 'hidden', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border-primary)' }}>
        {/* Animated Background Orbs & Shapes */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1], 
            x: [0, 50, 0], 
            y: [0, -30, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'var(--accent-purple)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.12 }}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1], 
            x: [0, -40, 0], 
            y: [0, 60, 0],
            rotate: [0, -45, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '15%', right: '15%', width: '250px', height: '250px', background: 'var(--accent-cyan)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.12 }}
        />

        {/* Floating Geometric Outlines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i }}
            style={{ 
              position: 'absolute', 
              top: `${20 + i * 25}%`, 
              left: `${10 + i * 20}%`, 
              width: '150px', 
              height: '150px', 
              border: '1px solid var(--text-primary)', 
              borderRadius: i === 1 ? '50%' : '20px',
              zIndex: 1
            }}
          />
        ))}

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

          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px', color: 'var(--text-primary)' }}
          >
            Empower your team with <br /> 
            <motion.span 
              animate={{ color: ['#8B5CF6', '#06B6D4', '#8B5CF6'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Agentic Intelligence.
            </motion.span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '48px' }}
          >
            Design, deploy, and scale autonomous AI agents that handle complex workflows while you focus on high-level strategy.
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {featureList.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 10, color: 'var(--accent-purple)' }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-primary)', cursor: 'default' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {feature.icon}
                </div>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: 'auto', paddingTop: '40px' }}
        >
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Trusted by innovative teams</p>
          <div style={{ display: 'flex', gap: '24px', opacity: 0.6 }}>
            {['ACME', 'QUANTUM', 'VERTEX'].map((brand) => (
              <motion.span 
                key={brand}
                whileHover={{ opacity: 1, scale: 1.1, color: 'var(--text-primary)' }}
                style={{ fontSize: '14px', fontWeight: 700, cursor: 'default' }}
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side: Sign In Form */}
      <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <div style={{ marginBottom: '40px' }}>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}
            >
              Sign In
            </motion.h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Enter your credentials to access your dashboard</p>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                <Link href="/auth/forgot-password" style={{ fontSize: '12px', color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '14px 44px 14px 44px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.2s' }}
                  className="focus-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '12px', opacity: loading ? 0.7 : 1, transition: 'transform 0.1s active' }}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Don't have an account? </span>
            <Link href="/auth/signup" style={{ color: 'var(--accent-cyan)', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

