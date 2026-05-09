import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an agent name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  icon: {
    type: String,
    default: '🤖',
  },
  color: {
    type: String,
    default: '#8B5CF6',
  },
  model: {
    type: String,
    required: true,
    default: 'llama3.2',
  },
  temperature: {
    type: Number,
    default: 0.7,
  },
  systemPrompt: {
    type: String,
    default: 'You are a helpful assistant.',
  },
  tools: {
    webSearch: { type: Boolean, default: false },
    customApi: { type: Boolean, default: false },
  },
  tags: { type: [String], default: [] },
  knowledge: [{
    fileName: { type: String, required: true },
    content: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    size: { type: Number, default: 0 },
  }],
  memory: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  settings: {
    greeting: { type: String, default: '' },
    cacheEnabled: { type: Boolean, default: true },
    cacheTTL: { type: Number, default: 3600 },
    onError: { type: String, enum: ['stop', 'skip'], default: 'stop' },
  },
  stats: {
    totalExecutions: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    avgLatency: { type: Number, default: 0 },
    costToDate: { type: Number, default: 0 },
    lastExecutedAt: { type: Date },
  },
  workflow: {
    nodes: { type: [mongoose.Schema.Types.Mixed], default: [] },
    connections: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  apiKey: {
    type: String,
    default: () => 'ak-' + Math.random().toString(36).substr(2, 24),
  },
  version: {
    type: String,
    default: '1.0.0',
  },
  activeVersion: {
    type: String,
    default: '1.0.0',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);
