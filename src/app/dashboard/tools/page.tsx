'use client';
import { useState, useEffect } from 'react';
import { toolsAPI } from '@/lib/api';

const DEMO_TOOLS = [
  { slug: 'http_get', name: 'HTTP GET', icon: '🌐', category: 'integration', description: 'Make HTTP GET request to any URL' },
  { slug: 'http_post', name: 'HTTP POST', icon: '📤', category: 'integration', description: 'Make HTTP POST request with JSON body' },
  { slug: 'extract_json', name: 'Extract JSON', icon: '📋', category: 'transformation', description: 'Parse and extract JSON from text' },
  { slug: 'decision', name: 'Decision (If/Else)', icon: '🔀', category: 'logic', description: 'Branch execution based on a condition' },
  { slug: 'loop', name: 'Loop', icon: '🔄', category: 'logic', description: 'Iterate over array items' },
  { slug: 'text_replace', name: 'Text Replace', icon: '🔤', category: 'transformation', description: 'Replace text using regex pattern' },
  { slug: 'text_split', name: 'Text Split', icon: '✂️', category: 'transformation', description: 'Split text by delimiter' },
  { slug: 'math_operation', name: 'Math Operation', icon: '🔢', category: 'logic', description: 'Basic math operations (+, -, *, /, %)' },
  { slug: 'wait', name: 'Wait', icon: '⏱️', category: 'logic', description: 'Pause execution for N seconds' },
  { slug: 'log', name: 'Log', icon: '📝', category: 'logic', description: 'Log a message for debugging' },
];

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    toolsAPI.list().then((r) => setTools(r.data.data)).catch(() => setTools(DEMO_TOOLS));
  }, []);

  const categories = [...new Set(tools.map((t) => t.category))];
  const filtered = tools.filter((t) => !filter || t.category === filter);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Built-in Tools</h2>
      <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 24 }}>{tools.length} tools available for your agent workflows</p>

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
        {categories.map((c) => <button key={c} className={`tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map((tool) => (
          <div className="card" key={tool.slug}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{tool.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{tool.name}</div>
                <span className="badge badge-gray">{tool.category}</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
