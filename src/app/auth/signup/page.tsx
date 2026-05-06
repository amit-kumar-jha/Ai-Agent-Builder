'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useStore from '@/lib/store';
import { Bot, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { signUpAction } from '@/actions/auth';

export default function SignUpPage() {
  const router = useRouter();
  const { setAuth } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      // Store in global state
      if (res.user) {
        setAuth(res.user, 'server-action');
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        <div className="auth-logo">
          <div className="auth-logo-icon"><Bot size={24} /></div>
          <div className="auth-logo-text">AgentOS</div>
        </div>

        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Start building enterprise AI agents today</p>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '8px', color: 'var(--accent-red)', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                style={{ width: '100%', padding: '12px 12px 12px 38px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)' }}
                className="focus-ring"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{ width: '100%', padding: '12px 12px 12px 38px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)' }}
                className="focus-ring"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 12px 12px 38px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)' }}
                className="focus-ring"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'var(--gradient-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="auth-footer">
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Already have an account? </span>
          <Link href="/auth/signin" style={{ color: 'var(--accent-purple)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>

      </div>
    </div>
  );
}
