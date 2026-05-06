import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  workspaceName: {
    type: String,
    default: 'Personal Workspace',
  },
  apiKey: {
    type: String,
    default: () => 'sk-live-' + Math.random().toString(36).substr(2, 24),
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
