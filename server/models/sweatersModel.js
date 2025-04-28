import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    category: { type: String },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const sweatersProduct = mongoose.model("Sweater", productSchema); // Collection name: "sweaters"
export default sweatersProduct;