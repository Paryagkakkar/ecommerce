import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    category: { type: String },
    image: { type: String, required: false },
    type: { type: String, enum: ["shirt", "tshirt"], default: "shirt" },
  },
  { timestamps: true }
);

const shirtsProduct = mongoose.model("shirtsProduct", productSchema);
export default shirtsProduct;