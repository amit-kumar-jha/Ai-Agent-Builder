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
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro', 'enterprise'],
    default: 'free',
  },
  whiteLabelEnabled: {
    type: Boolean,
    default: false,
  },

  // ─── Credit System ───
  credits: {
    type: Number,
    default: 100, // Free plan default
  },
  creditsUsed: {
    type: Number,
    default: 0,
  },
  bonusCredits: {
    type: Number,
    default: 0, // Purchased credit packs (never expire with monthly reset)
  },
  creditsResetAt: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 1); // First of next month
    },
  },
  creditPurchases: [{
    amount: { type: Number, required: true },
    price: { type: Number, required: true }, // USD cents
    stripePaymentId: { type: String },
    purchasedAt: { type: Date, default: Date.now },
  }],

  stripeCustomerId: {
    type: String,
    unique: true,
    sparse: true,
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  stripePriceId: {
    type: String,
  },
  stripeCurrentPeriodEnd: {
    type: Date,
  },
  paypalSubscriptionId: {
    type: String,
  },
  paypalPayoutEmail: {
    type: String,
  },
  totalEarnings: {
    type: Number,
    default: 0, // In USD
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
