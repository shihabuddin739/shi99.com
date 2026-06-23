import mongoose from 'mongoose';

const PaymentNumberSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['bikash', 'nagad', 'rocket'],
  },
  number: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Personal', 'Agent', 'Merchant'],
    default: 'Personal',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PaymentNumber || mongoose.model('PaymentNumber', PaymentNumberSchema);
