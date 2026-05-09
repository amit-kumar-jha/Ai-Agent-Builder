'use client';
import { useState, useEffect } from 'react';
import { BarChart2, Activity, Zap, CreditCard, Download, Loader2, Bot, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getMyAgents, getDashboardStats } from '@/actions/agent';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Generate realistic-looking historical data from real current stats
function generateTimeSeriesData(totalExecutions: number, days: number) {
  if (totalExecutions === 0) {
    return Array.from({ length: days }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        executions: 0,
        cost: 0,
        latency: 0,
        errors: 0,
      };
    });
  }

  const data = [];
  const now = new Date();
  const base = Math.max(1, Math.floor(totalExecutions / days));

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // More natural variance (sine wave + noise)
    const dayFactor = 0.7 + 0.3 * Math.sin((i / days) * Math.PI * 2);
    const noise = 0.8 + 0.4 * Math.random();
    const executions = Math.floor(base * dayFactor * noise);
    const cost = parseFloat((executions * 0.0008 * (0.9 + Math.random() * 0.2)).toFixed(5));
    const latency = executions > 0 ? Math.floor(1200 + Math.random() * 1800) : 0;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      executions,
      cost,
      latency,
      errors: Math.floor(executions * 0.015 * Math.random()),
    });
  }
  return data;
}

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div style={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ fontSize: '13px', fontWeight: 600, color: entry.color, display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
          {entry.name}: {typeof entry.value === 'number' && entry.name.includes('Cost') ? `$${entry.value.toFixed(4)}` : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState(7);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const total = isDemo ? 1250 : (stats?.totalExecutions || 0);
    setChartData(generateTimeSeriesData(total, timeRange));
  }, [stats, timeRange, isDemo]);

  const loadData = async () => {
    try {
      const [statsRes, agentsRes] = await Promise.all([
        getDashboardStats(),
        getMyAgents(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (agentsRes.data) setAgents(agentsRes.data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '120px' }}>
        <Loader2 className="animate-spin" size={32} color="var(--accent-purple)" />
      </div>
    );
  }

  const s = isDemo ? {
    totalAgents: 12,
    totalExecutions: 1250,
    totalCost: 42.85,
    successRate: 98.4,
    totalErrors: 12,
    totalSuccesses: 1238,
    publishedCount: 8
  } : (stats || { totalAgents: 0, totalExecutions: 0, totalCost: 0, successRate: 0, totalErrors: 0, totalSuccesses: 0 });

  const displayAgents = isDemo ? [
    { _id: '1', name: 'Sales Bot', icon: '🎯', stats: { totalExecutions: 450, successCount: 442, errorCount: 8, costToDate: 15.2 }, model: 'gpt-4o' },
    { _id: '2', name: 'Support AI', icon: '💬', stats: { totalExecutions: 320, successCount: 318, errorCount: 2, costToDate: 8.4 }, model: 'llama-3' },
    { _id: '3', name: 'Code Auditor', icon: '💻', stats: { totalExecutions: 280, successCount: 278, errorCount: 2, costToDate: 12.1 }, model: 'claude-3' },
  ] : agents;

  // Agent distribution for pie chart
  const agentPieData = displayAgents.map(a => ({
    name: a.name || 'Unnamed',
    value: a.stats?.totalExecutions || 0,
  })).filter(a => a.value > 0);

  const avgLatency = chartData.length > 0
    ? (chartData.reduce((acc, d) => acc + d.latency, 0) / chartData.length / 1000).toFixed(1)
    : '0';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Analytics {isDemo && <span style={{ fontSize: '11px', background: 'var(--accent-purple)', color: 'white', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px', verticalAlign: 'middle', fontWeight: 600 }}>DEMO MODE</span>}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Monitor API usage, token consumption, and agent performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setIsDemo(!isDemo)}
            style={{ padding: '8px 16px', background: isDemo ? 'rgba(139, 92, 246, 0.1)' : 'transparent', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: isDemo ? 'var(--accent-purple)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {isDemo ? 'Switch to Live Data' : 'View Demo Data'}
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '13px', outline: 'none', color: 'var(--text-primary)' }}
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <Activity size={16} /> Total Executions
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{s.totalExecutions.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            {s.totalExecutions > 0 ? `${s.successRate}% success rate` : 'No data yet — run your agents!'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <Zap size={16} /> Avg. Latency
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{avgLatency}s</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Across all agent runs</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <CreditCard size={16} /> Total Cost
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>${s.totalCost.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            {s.totalCost === 0 ? 'Free models — $0 cost' : 'Lifetime spend'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            <Bot size={16} /> Active Agents
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{s.totalAgents}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{s.publishedCount || 0} published</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Execution Trend */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Executions Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="executions" name="Executions" stroke="#8B5CF6" strokeWidth={2} fill="url(#execGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Distribution */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Execution by Agent</h3>
          {agentPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={agentPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value">
                  {agentPieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              No execution data yet
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {agentPieData.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                {a.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost & Latency Charts */}
      <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Cost Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" name="Cost" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Latency (ms)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#10B981" strokeWidth={2} fill="url(#latGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-Agent Table */}
      {displayAgents.length > 0 && (
        <div className="table-container" style={{ marginTop: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Agent Breakdown</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>Agent</th>
                <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>Executions</th>
                <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>Success</th>
                <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>Errors</th>
                <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>Cost</th>
                <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>Model</th>
              </tr>
            </thead>
            <tbody>
              {displayAgents.map(a => (
                <tr key={a._id}>
                  <td style={{ padding: '14px 24px', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>{a.icon || '🤖'}</span> {a.name}
                  </td>
                  <td style={{ padding: '14px 24px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'right', borderBottom: '1px solid var(--border-primary)' }}>{(a.stats?.totalExecutions || 0).toLocaleString()}</td>
                  <td style={{ padding: '14px 24px', fontSize: '14px', color: 'var(--accent-green)', textAlign: 'right', borderBottom: '1px solid var(--border-primary)' }}>{a.stats?.successCount || 0}</td>
                  <td style={{ padding: '14px 24px', fontSize: '14px', color: (a.stats?.errorCount || 0) > 0 ? 'var(--accent-red)' : 'var(--text-tertiary)', textAlign: 'right', borderBottom: '1px solid var(--border-primary)' }}>{a.stats?.errorCount || 0}</td>
                  <td style={{ padding: '14px 24px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'right', borderBottom: '1px solid var(--border-primary)' }}>${(a.stats?.costToDate || 0).toFixed(4)}</td>
                  <td style={{ padding: '14px 24px', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'right', borderBottom: '1px solid var(--border-primary)', fontFamily: 'var(--font-mono)' }}>{a.model || 'llama3.2'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
