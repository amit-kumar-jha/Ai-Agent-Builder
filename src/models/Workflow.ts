import mongoose from 'mongoose';

const WorkflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
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
  },
  nodes: {
    type: Array,
    default: [],
  },
  edges: {
    type: Array,
    default: [],
  }
}, { timestamps: true });

export default mongoose.models.Workflow || mongoose.model('Workflow', WorkflowSchema);
