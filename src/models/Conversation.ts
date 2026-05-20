import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fetching agent's conversations
conversationSchema.index({ agentId: 1, createdAt: -1 });

export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
