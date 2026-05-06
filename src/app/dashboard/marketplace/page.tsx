'use client';
import { LayoutTemplate, Search, Download } from 'lucide-react';

const templates = [
  { id: '1', name: 'Sales Development Rep', category: 'Sales', description: 'Automatically qualifies leads and drafts outreach emails based on LinkedIn profiles.', uses: '12.4k', icon: '🎯' },
  { id: '2', name: 'Zendesk Support Agent', category: 'Support', description: 'Drafts accurate responses to support tickets using your internal help center.', uses: '8.2k', icon: '💬' },
  { id: '3', name: 'Invoice Data Extractor', category: 'Data', description: 'Extracts structured JSON data (amount, vendor, date) from PDF invoices.', uses: '4.1k', icon: '📄' },
  { id: '4', name: 'Code Reviewer', category: 'Engineering', description: 'Reviews pull requests for security vulnerabilities and style violations.', uses: '18.9k', icon: '💻' },
  { id: '5', name: 'Social Media Manager', category: 'Marketing', description: 'Generates weekly Twitter and LinkedIn posts from blog articles.', uses: '6.5k', icon: '📱' },
  { id: '6', name: 'Meeting Summarizer', category: 'Productivity', description: 'Takes transcript files and generates action items and summaries.', uses: '22.1k', icon: '📝' },
];

export default function MarketplacePage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Templates Marketplace</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Start building faster with pre-configured agent templates.</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            placeholder="Search templates..." 
            style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {['All', 'Sales', 'Support', 'Engineering', 'Marketing', 'Data'].map((cat, i) => (
          <button key={cat} style={{ padding: '8px 16px', background: i === 0 ? 'var(--text-primary)' : 'var(--bg-card)', color: i === 0 ? 'var(--bg-primary)' : 'var(--text-secondary)', border: i === 0 ? 'none' : '1px solid var(--border-primary)', borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {templates.map((template) => (
          <div key={template.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }} className="hover-bg-glass">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px' }}>{template.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-input)', padding: '4px 10px', borderRadius: '12px' }}>{template.category}</div>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{template.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '24px' }}>{template.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                <Download size={14} /> {template.uses} uses
              </div>
              <button style={{ padding: '8px 16px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
