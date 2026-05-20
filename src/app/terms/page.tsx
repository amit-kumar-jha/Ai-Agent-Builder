'use client';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 120px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, marginBottom: '40px' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <FileText size={24} color="var(--accent-purple)" />
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>Terms of Service</h1>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginBottom: '48px' }}>Last updated: May 18, 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', lineHeight: 1.8, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
            <p>By accessing or using the NexAgeAI platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>2. Description of Service</h2>
            <p>NexAgeAI provides a cloud-based platform that allows users to create, configure, test, and deploy AI-powered agents. The Service includes agent builder tools, knowledge base management, API access, an embeddable chat widget, and a marketplace for agent templates.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>3. Account Registration</h2>
            <p>You must provide accurate and complete registration information. You are responsible for maintaining the security of your account credentials. You are fully responsible for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>4. Usage & Billing</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Free Plan:</strong> Includes 3 agents and 100 credits per month.</li>
              <li><strong>Pro Plan ($49/mo):</strong> Unlimited agents, 10,000 credits per month, and access to premium features including the embeddable widget and white-labeling.</li>
              <li><strong>Credit Packs:</strong> One-time purchases of additional credits. Bonus credits from packs do not expire with monthly resets.</li>
              <li>Payments are processed securely via PayPal. All sales are final unless otherwise required by applicable law.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Use the Service for any unlawful or harmful purpose.</li>
              <li>Attempt to reverse-engineer, decompile, or disassemble any part of the Service.</li>
              <li>Transmit any malicious code, viruses, or harmful content through agents.</li>
              <li>Abuse the API or attempt to circumvent rate limits or credit metering.</li>
              <li>Create agents that generate illegal, harmful, or deceptive content.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>6. Intellectual Property</h2>
            <p>You retain ownership of all content you create using the Service, including agent configurations, system prompts, and uploaded knowledge base files. NexAgeAI retains ownership of the platform, its code, design, and branding.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>7. Marketplace Terms</h2>
            <p>If you publish agents on the NexAgeAI Marketplace with a price, you will receive 80% of each sale as revenue share. NexAgeAI retains a 20% platform fee. Payouts are made via PayPal to the email configured in your Settings. Minimum payout threshold is $10.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>8. Limitation of Liability</h2>
            <p>NexAgeAI is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Service. AI-generated outputs are not guaranteed to be accurate and should not be relied upon for critical decisions without human verification.</p>
          </section>

          <section id="sla">
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>9. Service Level Agreement (SLA)</h2>
            <p>For Pro and Enterprise plans, we target 99.9% uptime for the NexAgeAI platform, excluding scheduled maintenance windows. Scheduled maintenance will be communicated at least 24 hours in advance via email.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>10. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time from the Settings page. Upon deletion, your data will be permanently removed within 30 days.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>11. Contact</h2>
            <p>For questions about these Terms, please contact us at <strong>support@nexageai.com</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
