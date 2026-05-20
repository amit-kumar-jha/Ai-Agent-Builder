'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useStore from '@/lib/store';
import { Bot, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Workflow, Database, Globe, Rocket } from 'lucide-react';
import { signUpAction } from '@/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';

const signupFeatures = [
  { icon: <Workflow size={18} />, text: 'Visual workflow builder included' },
  { icon: <Database size={18} />, text: 'Unlimited vector storage' },
  { icon: <Globe size={18} />, text: 'Global deployment in one click' }
];

export default function SignUpPage() {
  const router = useRouter();
  const { setAuth } = useStore();
  const [name, setName] = useState('');
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
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      const res = await signUpAction(formData);
      
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
        {/* Unique Animated Background for Signup */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'linear-gradient(45deg, var(--accent-purple), transparent)', borderRadius: '40%', filter: 'blur(120px)', opacity: 0.15 }}
        />

        {/* Floating Particles for Signup */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i }}
            style={{ 
              position: 'absolute', 
              top: `${10 + i * 15}%`, 
              left: `${5 + i * 15}%`, 
              width: '4px', 
              height: '4px', 
              background: 'var(--accent-cyan)',
              borderRadius: '50%',
              boxShadow: '0 0 10px var(--accent-cyan)'
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

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, rotate: [-1, 1, -1] }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.05em', cursor: 'default' }}
          >
            <Rocket size={14} /> NEW: V2.0 AGENT ENGINE
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px', color: 'var(--text-primary)' }}
          >
            Join the future of <br /> 
            <motion.span 
              animate={{ color: ['#06B6D4', '#34D399', '#06B6D4'] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Automated Labor.
            </motion.span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '48px' }}
          >
            Create your account in seconds and start building intelligent agents that learn, adapt, and execute perfectly.
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {signupFeatures.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 12, scale: 1.02 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-primary)', cursor: 'default' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  {feature.icon}
                </div>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Sign Up Form */}
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
              Create Account
            </motion.h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Start your 14-day free trial today</p>
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
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.2s' }}
                  className="focus-ring"
                />
              </div>
            </div>

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
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
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
              style={{ width: '100%', padding: '14px', background: 'var(--gradient-primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '12px', opacity: loading ? 0.7 : 1, transition: 'transform 0.1s active', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)' }}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Already have an account? </span>
            <Link href="/auth/signin" style={{ color: 'var(--accent-purple)', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </div>

          <p style={{ marginTop: '32px', fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
            By creating an account, you agree to our <Link href="/terms" style={{ textDecoration: 'underline' }}>Terms of Service</Link> and <Link href="/privacy" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

