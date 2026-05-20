import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      default: 'chat_gate',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate leads for the same agent + email
leadSchema.index({ agentId: 1, email: 1 }, { unique: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
