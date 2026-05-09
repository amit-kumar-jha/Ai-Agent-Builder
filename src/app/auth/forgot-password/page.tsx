'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bot, Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { forgotPasswordAction } from '@/actions/password';

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
      // In dev mode, we get the reset URL back
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
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-logo">
          <div className="auth-logo-icon" style={{ padding: 0, overflow: 'hidden', background: 'transparent' }}><img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
          <div className="auth-logo-text">NexAgeAI</div>
        </div>

        {!success ? (
          <>
            <h1 className="auth-title">Forgot password?</h1>
            <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '8px', color: 'var(--accent-red)', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send Reset Link <ArrowRight size={16} /></>}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={28} color="var(--accent-green)" />
              </div>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
                If an account exists for <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>, we've sent a password reset link.
              </p>
            </div>

            {/* Dev Mode: Show reset link directly */}
            {resetUrl && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-amber)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', background: 'var(--accent-amber)', borderRadius: '50%', display: 'inline-block' }}></span>
                  Development Mode
                </div>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '10px', padding: '14px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: 1.5 }}>
                  {resetUrl}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={copyResetLink}
                    style={{ flex: 1, padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                  >
                    <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <Link href={resetUrl.replace(/^https?:\/\/[^/]+/, '')} style={{ textDecoration: 'none', flex: 1 }}>
                    <button
                      style={{ width: '100%', padding: '10px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <ExternalLink size={14} /> Open Reset Page
                    </button>
                  </Link>
                </div>
              </div>
            )}

            <button
              onClick={() => { setSuccess(false); setEmail(''); setResetUrl(''); }}
              style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              Try another email
            </button>
          </>
        )}

        <div className="auth-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={14} color="var(--text-tertiary)" />
          <Link href="/auth/signin" style={{ color: 'var(--accent-cyan)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Back to Sign In</Link>
        </div>

      </div>
    </div>
  );
}
