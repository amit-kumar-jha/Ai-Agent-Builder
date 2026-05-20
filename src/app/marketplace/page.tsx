'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Zap, 
  Star, 
  Users, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Bot,
  Code,
  Layout,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MarketplacePage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const res = await fetch('/api/marketplace');
        const data = await res.json();
        if (data.success) setAgents(data.data);
      } catch (err) {
        console.error('Failed to fetch marketplace');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  const categories = [
    { name: 'All', icon: <Sparkles size={14} /> },
    { name: 'Content', icon: <Code size={14} /> },
    { name: 'Support', icon: <MessageSquare size={14} /> },
    { name: 'Design', icon: <Layout size={14} /> },
    { name: 'Automation', icon: <Zap size={14} /> }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || agent.tags.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border-primary)', padding: '20px 40px', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--accent-purple)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>AgentOS <span style={{ color: 'var(--accent-purple)' }}>Market</span></span>
          </Link>

          <div style={{ flex: 1, maxWidth: '500px', margin: '0 40px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={16} />
            <input 
              type="text" 
              placeholder="Search AI Agents, automations, prompts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: '10px', padding: '10px 10px 10px 40px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/dashboard/agents/new" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Sell Your Agent</Link>
            <button style={{ background: 'var(--accent-purple)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <ShoppingBag size={16} /> Cart (0)
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '60px 40px', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '48px', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.03em' }}
          >
            The Ultimate <span style={{ background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Agent</span> Marketplace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px' }}
          >
            Discover, buy, and deploy pre-trained AI agents built by top engineers. Automate your workflow in seconds.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ padding: '0 40px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Categories */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '100px', 
                background: activeCategory === cat.name ? 'var(--accent-purple)' : 'var(--bg-secondary)',
                color: activeCategory === cat.name ? 'white' : 'var(--text-secondary)',
                border: activeCategory === cat.name ? '1px solid var(--accent-purple)' : '1px solid var(--border-primary)',
                fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: '380px', borderRadius: '16px', background: 'var(--bg-secondary)', animation: 'pulse 2s infinite' }} />
            ))}
          </div>
        ) : filteredAgents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Bot size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>No agents found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredAgents.map((agent) => (
              <motion.div 
                key={agent._id}
                whileHover={{ y: -5 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '160px', background: `linear-gradient(135deg, ${agent.color}22, ${agent.color}44)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '64px' }}>{agent.icon}</div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} fill="#FFD700" color="#FFD700" /> 4.9
                  </div>
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{agent.name}</h3>
                    <div style={{ fontWeight: 800, color: 'var(--accent-green)', fontSize: '18px' }}>
                      {agent.marketplacePrice === 0 ? 'FREE' : `$${agent.marketplacePrice}`}
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {agent.description}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      <Users size={14} /> {agent.stats?.totalExecutions || 0} installs
                    </div>
                    <Link 
                      href={`/marketplace/${agent._id}`}
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      View Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
