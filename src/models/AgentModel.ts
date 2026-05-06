import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['input', 'llm', 'tool', 'decision', 'action', 'output', 'loop'],
    },
    label: { type: String, default: '' },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const connectionSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: mongoose.Schema.Types.Mixed, required: true },
    label: String,
  },
  { _id: false }
);

const versionSchema = new mongoose.Schema(
  {
    version: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workflow: { type: mongoose.Schema.Types.Mixed },
    changelog: String,
  },
  { _id: false }
);

const agentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // Also support the simpler "user" field from the frontend model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'active'],
      default: 'draft',
    },
    version: { type: String, default: '0.1.0' },

    // Agent config fields (simple agent mode)
    model: { type: String, default: 'gpt-4' },
    temperature: { type: Number, default: 0.7 },
    systemPrompt: { type: String, default: 'You are a helpful assistant.' },
    tools: {
      webSearch: { type: Boolean, default: false },
      customApi: { type: Boolean, default: false },
    },
    memory: { type: Boolean, default: true },

    // Core workflow DSL (advanced builder mode)
    workflow: {
      nodes: [nodeSchema],
      connections: [connectionSchema],
    },

    // Versioning
    versions: [versionSchema],
    activeVersion: { type: String, default: '0.1.0' },

    // Metadata
    tags: [{ type: String, trim: true }],
    icon: { type: String, default: '🤖' },
    color: { type: String, default: '#8B5CF6' },
    public: { type: Boolean, default: false },
    marketplacePrice: { type: Number, default: 0 },

    // Settings
    settings: {
      timeout: { type: Number, default: 300 },
      maxRetries: { type: Number, default: 2 },
      retryDelay: { type: Number, default: 1000 },
      onError: {
        type: String,
        enum: ['stop', 'retry', 'skip', 'escalate'],
        default: 'stop',
      },
      cacheEnabled: { type: Boolean, default: true },
      cacheTTL: { type: Number, default: 3600 },
    },

    // Stats
    stats: {
      totalExecutions: { type: Number, default: 0 },
      successCount: { type: Number, default: 0 },
      errorCount: { type: Number, default: 0 },
      avgLatency: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
      costToDate: { type: Number, default: 0 },
      lastExecutedAt: Date,
    },

    // API Access
    apiKey: { type: String, unique: true, sparse: true },
    webhookUrl: String,

    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Indexes
agentSchema.index({ userId: 1, deletedAt: 1 });
agentSchema.index({ user: 1 });
agentSchema.index({ status: 1 });
agentSchema.index({ tags: 1 });
agentSchema.index({ public: 1, status: 1 });

export default mongoose.models.Agent || mongoose.model('Agent', agentSchema);
