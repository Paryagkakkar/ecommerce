import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String },
  color: { type: String },
  category: { type: String },
});

const CartItem = mongoose.model("CartItem", cartSchema);

export default CartItem;
