import mongoose from "mongoose";
import shirtsProduct from "../models/shirtModel.js";

// 📌 1️⃣ Get all shirts
export const getshirts = async (req, res) => {
  try {
    const { type } = req.query;
    console.log("Querying shirts with type:", type);
    if (type && !["shirt", "tshirt"].includes(type)) {
      console.warn("Invalid type parameter:", type);
      return res.status(400).json({ error: "Invalid type parameter. Use 'shirt' or 'tshirt'." });
    }
    const query = type ? { type } : {};
    const products = await shirtsProduct.find(query).lean();
    console.log("Fetched shirts:", products.length, "items");
    if (products.length === 0) {
      console.log("No shirts found for query:", query);
    }
    res.json(products);
  } catch (error) {
    console.error("Error fetching shirts:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to fetch shirts" });
  }
};

// 📌 2️⃣ Get single shirt
export const getshirtsById = async (req, res) => {
  try {
    console.log("Fetching shirt by ID:", req.params.id);
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn("Invalid shirt ID:", req.params.id);
      return res.status(400).json({ error: "Invalid shirt ID" });
    }
    const product = await shirtsProduct.findById(req.params.id).lean();
    if (!product) {
      console.log("Shirt not found:", req.params.id);
      return res.status(404).json({ error: "Shirt not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching shirt by ID:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to fetch shirt" });
  }
};

// 📌 3️⃣ Create shirt (with file upload)
export const createshirts = async (req, res) => {
  try {
    const { title, price, size, color, category, type } = req.body;
    const image = req.file ? `/Uploads/${req.file.filename}` : "";
    console.log("Creating shirt:", { title, price, size, color, category, type, image });

    if (!title || !price) {
      console.warn("Missing required fields:", { title, price });
      return res.status(400).json({ error: "Title and price are required" });
    }

    const newProduct = new shirtsProduct({
      title,
      price: parseFloat(price),
      size,
      color,
      category,
      image,
      type: type || "shirt",
    });
    const savedProduct = await newProduct.save();
    console.log("Created shirt:", savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating shirt:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to create shirt" });
  }
};

// 📌 4️⃣ Update shirt (with file upload)
export const updateshirts = async (req, res) => {
  try {
    console.log("Received update request for shirt:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn("Invalid shirt ID:", req.params.id);
      return res.status(400).json({ error: "Invalid shirt ID" });
    }

    const { title, price, size, color, category, type } = req.body;
    const shirt = await shirtsProduct.findById(req.params.id);

    if (!shirt) {
      console.log("Shirt not found for update:", req.params.id);
      return res.status(404).json({ error: "Shirt not found" });
    }

    shirt.title = title || shirt.title;
    shirt.price = price ? parseFloat(price) : shirt.price;
    shirt.size = size || shirt.size;
    shirt.color = color || shirt.color;
    shirt.category = category || shirt.category;
    shirt.type = type || shirt.type || "shirt";

    if (req.file) {
      shirt.image = `/Uploads/${req.file.filename}`;
    }

    const updatedShirt = await shirt.save();
    console.log("Updated shirt:", updatedShirt);
    res.json({ success: true, product: updatedShirt });
  } catch (error) {
    console.error("Error updating shirt:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to update shirt" });
  }
};

// 📌 5️⃣ Delete shirt
export const deleteshirts = async (req, res) => {
  try {
    console.log("Deleting shirt:", req.params.id);
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn("Invalid shirt ID:", req.params.id);
      return res.status(400).json({ error: "Invalid shirt ID" });
    }

    const product = await shirtsProduct.findById(req.params.id);
    if (!product) {
      console.log("Shirt not found for deletion:", req.params.id);
      return res.status(404).json({ error: "Shirt not found" });
    }

    await product.deleteOne();
    console.log("Shirt deleted:", req.params.id);
    res.json({ message: "Shirt deleted successfully" });
  } catch (error) {
    console.error("Error deleting shirt:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to delete shirt" });
  }
};