'use client';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 120px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, marginBottom: '40px' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Shield size={24} color="var(--accent-purple)" />
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>Privacy Policy</h1>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginBottom: '48px' }}>Last updated: May 18, 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', lineHeight: 1.8, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>1. Information We Collect</h2>
            <p>When you create an account on NexAgeAI, we collect the following information:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Account Information:</strong> Your name, email address, and hashed password.</li>
              <li><strong>Usage Data:</strong> Agent configurations, execution logs, and API usage metrics.</li>
              <li><strong>Payment Information:</strong> Processed securely by PayPal. We do not store your full payment details.</li>
              <li><strong>Uploaded Content:</strong> Knowledge base files and documents you upload to train your agents.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Provide, maintain, and improve the NexAgeAI platform.</li>
              <li>Process transactions and send billing-related communications.</li>
              <li>Personalize your experience and deliver relevant content.</li>
              <li>Monitor usage to enforce fair use policies and prevent abuse.</li>
              <li>Communicate important updates, security alerts, and support messages.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>3. Data Storage & Security</h2>
            <p>Your data is stored in secure MongoDB Atlas clusters with encryption at rest and in transit. We implement industry-standard security measures including HTTPS, hashed passwords (bcrypt), and JWT-based authentication. Access to production databases is restricted to authorized personnel only.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>4. Third-Party Services</h2>
            <p>We use the following third-party services to operate the platform:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>PayPal:</strong> Payment processing.</li>
              <li><strong>OpenRouter / LLM Providers:</strong> AI model inference (your prompts are sent to these providers).</li>
              <li><strong>Vercel:</strong> Hosting and edge network delivery.</li>
              <li><strong>MongoDB Atlas:</strong> Database hosting.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information at any time from your account Settings page. To request complete account deletion, contact us at <strong>support@nexageai.com</strong>.</p>
          </section>

          <section id="cookies">
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>6. Cookies</h2>
            <p>We use essential cookies only — specifically an authentication token (<code>agentos_token</code>) stored as an HTTP-only cookie to maintain your login session. We do not use third-party tracking cookies or advertising pixels.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <strong>support@nexageai.com</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
