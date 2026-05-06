'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import { agentsAPI } from '@/lib/api';
import { Play, ArrowLeft, Clock, DollarSign, Cpu, ChevronDown, ChevronRight } from 'lucide-react';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const { addToast } = useStore();

  const [input, setInput] = useState('{\n  "message": "Hello, how can you help me?"\n}');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    try {
      const parsedInput = JSON.parse(input);
      const res = await agentsAPI.test(agentId, parsedInput);
      setResult(res.data);
    } catch (err: any) {
      // Demo mock result
      setResult({
        success: true,
        executionId: 'exec_demo_' + Date.now(),
        output: { response: '[Mock GPT-4 response] Processed: "Hello, how can you help me?"...' },
        trace: [
          { nodeId: 'node_input', type: 'input', status: 'completed', latency: 1, input: JSON.parse(input || '{}'), output: JSON.parse(input || '{}'), cost: 0 },
          { nodeId: 'node_llm', type: 'llm', status: 'completed', latency: 2840, input: { prompt: 'Hello...', model: 'gpt-4' }, output: '[Mock GPT-4 response] Processed: "Hello"...', cost: 0.0065, tokensUsed: { prompt: 42, completion: 85, total: 127 }, cacheHit: false },
          { nodeId: 'node_output', type: 'output', status: 'completed', latency: 1, input: {}, output: { response: '...' }, cost: 0 },
        ],
        cost: 0.0065,
        latency: 2842,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
      return next;
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-ghost" onClick={() => router.push(`/dashboard/agents/${agentId}/builder`)}><ArrowLeft size={16} /></button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Test Console</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, minHeight: 500 }}>
        {/* Input Panel */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📥 Input</h3>
          <textarea
            className="input textarea"
            style={{ fontFamily: 'var(--font-mono)', minHeight: 300, fontSize: 13 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
          />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={handleRun} disabled={loading}>
              {loading ? <><span className="spinner" /> Running...</> : <><Play size={16} /> Run Test</>}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📤 Result</h3>

          {!result && !loading && (
            <div className="empty-state" style={{ padding: 40 }}>
              <div className="empty-state-icon">⚡</div>
              <p className="empty-state-desc">Run a test to see the output and execution trace here.</p>
            </div>
          )}

          {loading && (
            <div className="loading-overlay">
              <div className="spinner spinner-lg" />
            </div>
          )}

          {result && (
            <>
              {/* Summary */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                <div className="badge badge-green">✓ {result.success ? 'Completed' : 'Failed'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-tertiary)' }}>
                  <Clock size={12} /> {result.latency > 1000 ? `${(result.latency / 1000).toFixed(2)}s` : `${result.latency}ms`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-tertiary)' }}>
                  <DollarSign size={12} /> ${(result.cost || 0).toFixed(6)}
                </div>
              </div>

              {/* Output */}
              <div style={{ marginBottom: 20 }}>
                <div className="label">Output</div>
                <div className="trace-data">{JSON.stringify(result.output, null, 2)}</div>
              </div>

              {/* Execution Trace */}
              {result.trace && (
                <div>
                  <div className="label" style={{ marginBottom: 10 }}>Execution Trace</div>
                  <div className="trace-viewer">
                    {result.trace.map((entry: any) => (
                      <div className="trace-node" key={entry.nodeId}>
                        <div className="trace-node-header" onClick={() => toggleNode(entry.nodeId)}>
                          <div className={`trace-node-status ${entry.status}`} />
                          <span className="trace-node-name">{entry.nodeId}</span>
                          <span className="trace-node-meta">
                            <span>{entry.latency}ms</span>
                            {entry.cost > 0 && <span>${entry.cost.toFixed(6)}</span>}
                            {entry.tokensUsed && <span>{entry.tokensUsed.total} tok</span>}
                            {entry.cacheHit && <span className="badge badge-cyan" style={{ fontSize: 10 }}>cached</span>}
                          </span>
                          {expandedNodes.has(entry.nodeId) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                        {expandedNodes.has(entry.nodeId) && (
                          <div className="trace-node-body">
                            <div className="label" style={{ marginTop: 10 }}>Input</div>
                            <div className="trace-data">{JSON.stringify(entry.input, null, 2)}</div>
                            <div className="label" style={{ marginTop: 10 }}>Output</div>
                            <div className="trace-data">{JSON.stringify(entry.output, null, 2)}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
