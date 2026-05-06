import mongoose from 'mongoose';

const traceEntrySchema = new mongoose.Schema(
  {
    nodeId: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ['running', 'completed', 'failed', 'skipped'],
      default: 'running',
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    latency: { type: Number, default: 0 },

    // I/O
    input: { type: mongoose.Schema.Types.Mixed, default: {} },
    output: { type: mongoose.Schema.Types.Mixed, default: null },
    error: { type: String, default: null },

    // LLM-specific
    model: String,
    tokensUsed: {
      prompt: Number,
      completion: Number,
      total: Number,
    },
    cost: { type: Number, default: 0 },
    cacheHit: { type: Boolean, default: false },

    // Action-specific
    actionType: String,
    httpStatus: Number,
    url: String,

    // Decision-specific
    condition: String,
    conditionResult: Boolean,
    nextNodeId: String,
  },
  { _id: false }
);

const executionSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
      index: true,
    },
    agentVersion: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },

    executionId: { type: String, unique: true },
    status: {
      type: String,
      enum: ['running', 'completed', 'failed', 'cancelled'],
      default: 'running',
    },

    // I/O
    input: { type: mongoose.Schema.Types.Mixed, default: {} },
    output: { type: mongoose.Schema.Types.Mixed, default: null },
    error: { type: String, default: null },

    // Trace
    trace: [traceEntrySchema],

    // Cost
    totalCost: { type: Number, default: 0 },
    costBreakdown: {
      llm: { type: Number, default: 0 },
      tools: { type: Number, default: 0 },
      webhook: { type: Number, default: 0 },
      storage: { type: Number, default: 0 },
    },

    // Performance
    totalLatency: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },

    // Metadata
    source: {
      type: String,
      enum: ['api', 'webhook', 'ui_test', 'scheduled'],
      default: 'api',
    },
    sourceIp: String,
    userAgent: String,

    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
executionSchema.index({ agentId: 1, createdAt: -1 });
executionSchema.index({ userId: 1, createdAt: -1 });
executionSchema.index({ status: 1 });
executionSchema.index({ executionId: 1 });

export default mongoose.models.Execution || mongoose.model('Execution', executionSchema);
