'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ChevronLeft, 
  ShoppingBag, 
  Star, 
  Users, 
  Zap, 
  ShieldCheck, 
  MessageSquare,
  Globe,
  Loader2,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import { motion } from 'framer-motion';

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [agent, setAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/agents/${agentId}`);
        const data = await res.json();
        if (data.success) setAgent(data.data);
      } catch (err) {
        console.error('Failed to fetch agent');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgent();
  }, [agentId]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" color="var(--accent-purple)" size={48} />
      </div>
    );
  }

  if (!agent) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Agent not found</h2>
        <Link href="/marketplace" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test'}&currency=USD`}
        onLoad={() => setPaypalLoaded(true)}
      />

      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border-primary)', padding: '20px 40px', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/marketplace" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <ChevronLeft size={20} /> Back
          </Link>
          <div style={{ flex: 1 }} />
          <Link href="/dashboard" style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', textDecoration: 'none', color: 'inherit' }}>
            AgentOS <span style={{ color: 'var(--accent-purple)' }}>Market</span>
          </Link>
          <div style={{ flex: 1 }} />
          <button style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600 }}>
            Share Agent
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' }}>
          {/* Left Column: Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
              <div style={{ width: '100px', height: '100px', background: `linear-gradient(135deg, ${agent.color}22, ${agent.color}44)`, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', border: '1px solid var(--border-primary)' }}>
                {agent.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h1 style={{ fontSize: '36px', fontWeight: 800 }}>{agent.name}</h1>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>VERIFIED</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={16} fill="#FFD700" color="#FFD700" /> 4.9 (124 reviews)</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={16} /> {agent.stats?.totalExecutions || 0} installs</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Globe size={16} /> Public Agent</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Description</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {agent.description || "This agent is designed to help you automate complex workflows with ease. It features advanced reasoning capabilities and custom tool integrations."}
              </p>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Key Capabilities</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { icon: <Zap size={18} />, title: 'High Performance', desc: 'Optimized for low latency' },
                  { icon: <ShieldCheck size={18} />, title: 'Enterprise Ready', desc: 'Built with security first' },
                  { icon: <MessageSquare size={18} />, title: 'Conversational', desc: 'Natural language interface' },
                  { icon: <Bot size={18} />, title: 'Multi-Model', desc: `Uses ${agent.model}` }
                ].map((item, i) => (
                  <div key={i} style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', display: 'flex', gap: '16px' }}>
                    <div style={{ color: 'var(--accent-purple)' }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout */}
          <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
            <div style={{ padding: '32px', background: 'var(--bg-card)', border: '2px solid var(--border-primary)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing Plan</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                <span style={{ fontSize: '42px', fontWeight: 800 }}>{agent.marketplacePrice === 0 ? 'FREE' : `$${agent.marketplacePrice}`}</span>
                {agent.marketplacePrice > 0 && <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>one-time payment</span>}
              </div>

              {purchaseSuccess ? (
                <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', borderRadius: '16px', textAlign: 'center' }}>
                  <Check size={32} color="var(--accent-green)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Purchase Successful!</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>The agent has been added to your dashboard.</div>
                  <Link href="/dashboard" style={{ background: 'var(--accent-green)', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>Go to Dashboard</Link>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                      <Check size={18} color="var(--accent-green)" /> <span>Full Source Code Access</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                      <Check size={18} color="var(--accent-green)" /> <span>Commercial Usage License</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                      <Check size={18} color="var(--accent-green)" /> <span>Lifetime Updates</span>
                    </div>
                  </div>

                  {paypalLoaded ? (
                    <PayPalButton 
                      agentId={agentId} 
                      price={agent.marketplacePrice} 
                      onSuccess={() => setPurchaseSuccess(true)}
                    />
                  ) : (
                    <div style={{ height: '50px', background: 'var(--bg-input)', borderRadius: '12px', animation: 'pulse 2s infinite' }} />
                  )}

                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '20px' }}>
                    Payments are secured by PayPal. By purchasing, you agree to our Marketplace Terms of Service.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

function PayPalButton({ agentId, price, onSuccess }: any) {
  useEffect(() => {
    // @ts-ignore
    if (window.paypal) {
      // @ts-ignore
      window.paypal.Buttons({
        createOrder: async () => {
          const res = await fetch('/api/billing/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'marketplace', agentId, price }),
          });
          const data = await res.json();
          return data.orderID;
        },
        onApprove: async (data: any) => {
          const res = await fetch('/api/billing/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID, type: 'marketplace', agentId }),
          });
          const capture = await res.json();
          if (capture.success) {
            onSuccess();
          }
        },
        style: {
          layout: 'vertical',
          height: 48,
          color: 'gold',
          shape: 'rect',
          label: 'buynow'
        }
      }).render('#paypal-button-container');
    }
  }, [agentId, price]);

  return <div id="paypal-button-container" />;
}
