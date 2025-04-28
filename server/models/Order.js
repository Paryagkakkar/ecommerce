import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true },
  userId: { type: String, default: null },
  userName: { type: String, default: 'Guest' },
  email: { type: String, default: null },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true }, // Maps to productName in frontend
      size: { type: String, required: true }, // Added
      color: { type: String, required: true }, // Added
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  status: { type: String, default: 'created' },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
});

export default mongoose.model('Order', orderSchema);