'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { agentsAPI } from '@/lib/api';
import { STATUS_COLORS } from '@/lib/constants';
import { ArrowLeft, Search, Filter, ChevronDown, ChevronRight, Clock, DollarSign } from 'lucide-react';

export default function LogsPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadLogs();
  }, [statusFilter]);

  const loadLogs = async () => {
    try {
      const res = await agentsAPI.logs(agentId, { status: statusFilter || undefined });
      setLogs(res.data.data || []);
    } catch {
      // Demo data
      setLogs([
        { _id: '1', executionId: 'exec_abc123', status: 'completed', totalCost: 0.0065, totalLatency: 2842, source: 'ui_test', input: { message: 'Hello' }, output: { response: 'Hi there!' }, trace: [{ nodeId: 'node_input', status: 'completed', latency: 1 }, { nodeId: 'node_llm', status: 'completed', latency: 2840, cost: 0.0065, tokensUsed: { total: 127 } }], createdAt: new Date(Date.now() - 60000).toISOString() },
        { _id: '2', executionId: 'exec_def456', status: 'completed', totalCost: 0.0042, totalLatency: 1950, source: 'api', input: { message: 'What is AI?' }, output: { response: 'AI is...' }, trace: [{ nodeId: 'node_input', status: 'completed', latency: 1 }, { nodeId: 'node_llm', status: 'completed', latency: 1948, cost: 0.0042 }], createdAt: new Date(Date.now() - 120000).toISOString() },
        { _id: '3', executionId: 'exec_ghi789', status: 'failed', totalCost: 0, totalLatency: 450, source: 'webhook', input: { message: '' }, output: null, error: 'Empty input', trace: [{ nodeId: 'node_input', status: 'failed', latency: 450, error: 'Empty input' }], createdAt: new Date(Date.now() - 300000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-ghost" onClick={() => router.push(`/dashboard/agents/${agentId}/builder`)}><ArrowLeft size={16} /></button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Execution Logs</h2>
        <div style={{ flex: 1 }} />
        <select className="select" style={{ width: 160 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="spinner spinner-lg" /></div>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No executions yet</h3>
          <p className="empty-state-desc">Run or test your agent to see execution logs here.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Status</th>
                <th>Source</th>
                <th>Latency</th>
                <th>Cost</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <>
                  <tr key={log._id} style={{ cursor: 'pointer' }} onClick={() => setExpandedLog(expandedLog === log._id ? null : log._id)}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{log.executionId}</td>
                    <td><span className={`badge badge-${STATUS_COLORS[log.status]}`}>{log.status}</span></td>
                    <td><span className="badge badge-gray">{log.source}</span></td>
                    <td style={{ fontSize: 13 }}>{log.totalLatency > 1000 ? `${(log.totalLatency / 1000).toFixed(2)}s` : `${log.totalLatency}ms`}</td>
                    <td style={{ fontSize: 13 }}>${(log.totalCost || 0).toFixed(6)}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatTime(log.createdAt)}</td>
                    <td>{expandedLog === log._id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                  </tr>
                  {expandedLog === log._id && (
                    <tr key={`${log._id}_detail`}>
                      <td colSpan={7} style={{ padding: 20, background: 'var(--bg-glass)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          <div>
                            <div className="label">Input</div>
                            <div className="trace-data">{JSON.stringify(log.input, null, 2)}</div>
                          </div>
                          <div>
                            <div className="label">Output</div>
                            <div className="trace-data">{JSON.stringify(log.output, null, 2)}</div>
                          </div>
                        </div>
                        {log.error && (
                          <div style={{ marginTop: 12 }}>
                            <div className="label" style={{ color: 'var(--accent-red)' }}>Error</div>
                            <div className="trace-data" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>{log.error}</div>
                          </div>
                        )}
                        {log.trace && (
                          <div style={{ marginTop: 16 }}>
                            <div className="label">Trace ({log.trace.length} nodes)</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                              {log.trace.map((t: any) => (
                                <div key={t.nodeId} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)', fontSize: 12 }}>
                                  <div className={`trace-node-status ${t.status}`} />
                                  <span style={{ fontWeight: 600 }}>{t.nodeId}</span>
                                  <span style={{ color: 'var(--text-muted)' }}>{t.latency}ms</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
