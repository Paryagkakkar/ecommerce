import mongoose from "mongoose";

const tshirtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
  category: { type: String, default: "" },
  image: { type: String, default: "" },
});

export default mongoose.model("TShirtProduct", tshirtSchema);