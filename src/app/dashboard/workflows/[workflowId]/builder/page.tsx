'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Save, Play, Loader2, GitMerge } from 'lucide-react';
import Link from 'next/link';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Edge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getWorkflow, saveWorkflow } from '@/actions/workflow';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Trigger' },
    position: { x: 250, y: 50 },
  },
];

export default function WorkflowBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.workflowId as string;

  const [name, setName] = useState('Loading...');
  const [description, setDescription] = useState('');
  
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadWorkflow() {
      const data = await getWorkflow(workflowId);
      if (data && !data.error) {
        setName(data.name || 'New Workflow');
        setDescription(data.description || '');
        if (data.nodes && data.nodes.length > 0) setNodes(data.nodes);
        if (data.edges && data.edges.length > 0) setEdges(data.edges);
      } else {
        alert('Failed to load workflow');
        router.push('/dashboard/workflows');
      }
      setIsLoading(false);
    }
    loadWorkflow();
  }, [workflowId, router]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    const res = await saveWorkflow(workflowId, { name, description, nodes, edges });
    setIsSaving(false);
    if (res.success) {
      alert('Workflow saved successfully!');
    } else {
      alert(res.error || 'Failed to save workflow');
    }
  };

  const addAgentNode = () => {
    const newNode = {
      id: Math.random().toString(36).substring(7),
      data: { label: 'Agent Node' },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  if (isLoading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="var(--accent-purple)" />
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', margin: '-32px -40px', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Bar */}
      <div style={{ height: '64px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/dashboard/workflows">
            <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={16} />
            </button>
          </Link>
          <div>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontSize: '16px', fontWeight: 600, background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
            />
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Workflow Builder</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={addAgentNode} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <GitMerge size={14} /> Add Node
          </button>
          <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)', opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Play size={14} /> Run Workflow
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="dark"
          style={{ background: 'var(--bg-primary)' }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
