import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // Image is mandatory
    type: { type: String, required: true, default: "jacket" }, // Added type field
  },
  { timestamps: true }
);

const jacketsProduct = mongoose.model("jacketsProduct", productSchema);
export default jacketsProduct;