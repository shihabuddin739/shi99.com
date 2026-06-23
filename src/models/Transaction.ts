import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'game_play'],
    required: true,
  },
  method: {
    type: String,
    enum: ['bikash', 'nagad', 'rocket', 'game'],
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  number: {
    type: String,
    required: false,
  },
  trxId: {
    type: String, // Only for deposit
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
