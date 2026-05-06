import axios from 'axios';

// No more external backend URL — all API routes are co-located in Next.js
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor — attach JWT from localStorage (for API route auth)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('agentos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('agentos_token');
      localStorage.removeItem('agentos_user');
      if (window.location.pathname !== '/auth/signin') {
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  signin: (data: { email: string; password: string }) =>
    api.post('/auth/signin', data),  // Maps to /api/auth/signin route
  me: () => api.get('/auth/me'),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// Agents
export const agentsAPI = {
  list: (params?: { search?: string; status?: string }) =>
    api.get('/agents', { params }),
  get: (id: string) => api.get(`/agents/${id}`),
  create: (data: { name: string; description?: string; workflow?: any }) =>
    api.post('/agents', data),
  update: (id: string, data: any) => api.patch(`/agents/${id}`, data),
  delete: (id: string) => api.delete(`/agents/${id}`),
  test: (id: string, input: any) => api.post(`/agents/${id}/test`, input),
  run: (id: string, input: any, apiKey: string) =>
    api.post(`/agents/${id}/run`, input, { headers: { 'X-API-Key': apiKey } }),
  logs: (id: string, params?: { page?: number; limit?: number; status?: string }) =>
    api.get(`/agents/${id}/logs`, { params }),
  publish: (id: string) => api.post(`/agents/${id}/publish`),
};

// Tools
export const toolsAPI = {
  list: () => api.get('/tools'),
  get: (slug: string) => api.get(`/tools/${slug}`),
};

export default api;
