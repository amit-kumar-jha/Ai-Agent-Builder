'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Bot, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { resetPasswordAction } from '@/actions/password';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setInvalidLink(true);
    }
  }, [token, email]);

  const passwordStrength = (pw: string) => {
    if (pw.length === 0) return { level: 0, label: '', color: '' };
    if (pw.length < 6) return { level: 1, label: 'Too short', color: 'var(--accent-red)' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'var(--accent-red)' };
    if (score === 2) return { level: 2, label: 'Fair', color: 'var(--accent-amber)' };
    if (score === 3) return { level: 3, label: 'Good', color: 'var(--accent-cyan)' };
    return { level: 4, label: 'Strong', color: 'var(--accent-green)' };
  };

  const strength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);

      const res = await resetPasswordAction(formData);

      if (res.error) {
        throw new Error(res.error);
      }

      setSuccess(true);
      // Redirect to sign-in after 3 seconds
      setTimeout(() => router.push('/auth/signin'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Invalid / expired link state
  if (invalidLink) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-logo">
            <div className="auth-logo-icon"><Bot size={24} /></div>
            <div className="auth-logo-text">AgentOS</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShieldAlert size={28} color="var(--accent-red)" />
            </div>
            <h1 className="auth-title">Invalid Reset Link</h1>
            <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>

            <Link href="/auth/forgot-password" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                Request New Link <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div className="auth-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ArrowLeft size={14} color="var(--text-tertiary)" />
            <Link href="/auth/signin" style={{ color: 'var(--accent-cyan)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Back to Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-logo">
          <div className="auth-logo-icon"><Bot size={24} /></div>
          <div className="auth-logo-text">AgentOS</div>
        </div>

        {!success ? (
          <>
            <h1 className="auth-title">Set new password</h1>
            <p className="auth-subtitle">Create a strong password for <strong style={{ color: 'var(--text-primary)' }}>{decodeURIComponent(email)}</strong></p>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '8px', color: 'var(--accent-red)', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '12px 40px 12px 38px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)' }}
                    className="focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= strength.level ? strength.color : 'var(--border-primary)', transition: 'all 0.3s ease' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '12px 40px 12px 38px', background: 'var(--bg-input)',
                      border: `1px solid ${confirmPassword.length > 0 && confirmPassword !== password ? 'var(--accent-red)' : 'var(--border-primary)'}`,
                      borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)'
                    }}
                    className="focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex' }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <span style={{ fontSize: '11px', color: 'var(--accent-red)', marginTop: '4px', display: 'block' }}>Passwords do not match</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || password.length < 6 || password !== confirmPassword}
                style={{
                  width: '100%', padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  cursor: loading || password.length < 6 || password !== confirmPassword ? 'not-allowed' : 'pointer',
                  marginTop: '8px', opacity: loading || password.length < 6 || password !== confirmPassword ? 0.5 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Reset Password <ArrowRight size={16} /></>}
              </button>
            </form>
          </>
        ) : (
          /* Success State */
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={28} color="var(--accent-green)" />
            </div>
            <h1 className="auth-title">Password reset!</h1>
            <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
              Your password has been successfully updated. Redirecting you to sign in...
            </p>

            <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                Sign In Now <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        )}

        <div className="auth-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={14} color="var(--text-tertiary)" />
          <Link href="/auth/signin" style={{ color: 'var(--accent-cyan)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Back to Sign In</Link>
        </div>

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} className="animate-spin" color="var(--accent-purple)" />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
