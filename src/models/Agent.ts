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
  memory: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active'],
    default: 'draft',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);
