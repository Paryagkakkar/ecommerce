import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{
    productId: { type: String, required: true },
    title: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
    image: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);