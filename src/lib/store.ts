'use client';
import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  avatar?: string;
}

interface Agent {
  _id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  icon: string;
  color: string;
  tags: string[];
  stats: {
    totalExecutions: number;
    successCount: number;
    errorCount: number;
    avgLatency: number;
    costToDate: number;
    lastExecutedAt?: string;
  };
  workflow: {
    nodes: any[];
    connections: any[];
  };
  settings: any;
  apiKey: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

interface TraceEntry {
  nodeId: string;
  type: string;
  status: string;
  latency: number;
  cost?: number;
  input: any;
  output: any;
  error?: string;
  tokensUsed?: { prompt: number; completion: number; total: number };
  cacheHit?: boolean;
}

interface AppState {
  // Auth
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;

  // Agents
  agents: Agent[];
  currentAgent: Agent | null;
  setAgents: (agents: Agent[]) => void;
  setCurrentAgent: (agent: Agent | null) => void;
  updateAgent: (id: string, data: Partial<Agent>) => void;

  // Builder
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // UI
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Toast
  toasts: { id: string; type: string; message: string }[];
  addToast: (type: string, message: string) => void;
  removeToast: (id: string) => void;
}

const useStore = create<AppState>((set) => ({
  // Auth
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    set({ user, accessToken: token, isAuthenticated: true });
  },
  clearAuth: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  // Agents
  agents: [],
  currentAgent: null,
  setAgents: (agents) => set({ agents }),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  updateAgent: (id, data) =>
    set((state) => ({
      agents: state.agents.map((a) => (a._id === id ? { ...a, ...data } : a)),
      currentAgent: state.currentAgent?._id === id ? { ...state.currentAgent, ...data } : state.currentAgent,
    })),

  // Builder
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // UI
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  activeTab: 'agents',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Toasts
  toasts: [],
  addToast: (type, message) => {
    const id = Date.now().toString();
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export default useStore;
export type { User, Agent, TraceEntry };
