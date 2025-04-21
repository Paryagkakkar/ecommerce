import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    category: { type: String },
    image: { type: String, required: false }, // Image file path stored as a string
  },
  { timestamps: true }
);

const sweatersProduct = mongoose.model("sweatersProduct", productSchema);
export default sweatersProduct;
