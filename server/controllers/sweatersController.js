import mongoose from "mongoose";
import sweatersProduct from "../models/sweatersModel.js";

// Get all sweaters
export const getSweaters = async (req, res) => {
  try {
    console.log("Querying sweaters");
    const products = await sweatersProduct.find().lean();
    console.log("Fetched sweaters:", products.length, "items");
    res.json(products);
  } catch (error) {
    console.error("Error fetching sweaters:", error.message, error.stack);
    res.status(500).json({ error: "Failed to fetch sweaters" });
  }
};

// Get single sweater by ID
export const getSweaterById = async (req, res) => {
  try {
    console.log("Fetching sweater by ID:", req.params.id);
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn("Invalid sweater ID:", req.params.id);
      return res.status(400).json({ error: "Invalid sweater ID" });
    }
    const product = await sweatersProduct.findById(req.params.id).lean();
    if (!product) {
      console.log("Sweater not found:", req.params.id);
      return res.status(404).json({ error: "Sweater not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching sweater by ID:", error.message, error.stack);
    res.status(500).json({ error: "Failed to fetch sweater" });
  }
};

// Create sweater
export const createSweater = async (req, res) => {
  try {
    const { title, price, size, color, category } = req.body;
    const image = req.file ? `/Uploads/${req.file.filename}` : "";
    console.log("Creating sweater:", { title, price, size, color, category, image });

    if (!title || !price) {
      console.warn("Missing required fields:", { title, price });
      return res.status(400).json({ error: "Title and price are required" });
    }

    const newProduct = new sweatersProduct({
      title,
      price: parseFloat(price),
      size,
      color,
      category,
      image,
    });
    const savedProduct = await newProduct.save();
    console.log("Created sweater:", savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating sweater:", error.message, error.stack);
    res.status(500).json({ error: "Failed to create sweater" });
  }
};

// Update sweater
export const updateSweater = async (req, res) => {
  try {
    console.log("Updating sweater:", req.params.id);
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn("Invalid sweater ID:", req.params.id);
      return res.status(400).json({ error: "Invalid sweater ID" });
    }

    const sweater = await sweatersProduct.findById(req.params.id);
    if (!sweater) {
      console.log("Sweater not found:", req.params.id);
      return res.status(404).json({ error: "Sweater not found" });
    }

    const { title, price, size, color, category } = req.body;
    sweater.title = title || sweater.title;
    sweater.price = price ? parseFloat(price) : sweater.price;
    sweater.size = size || sweater.size;
    sweater.color = color || sweater.color;
    sweater.category = category || sweater.category;
    if (req.file) {
      sweater.image = `/Uploads/${req.file.filename}`;
    }

    const updatedSweater = await sweater.save();
    console.log("Updated sweater:", updatedSweater);
    res.json({ success: true, product: updatedSweater });
  } catch (error) {
    console.error("Error updating sweater:", error.message, error.stack);
    res.status(500).json({ error: "Failed to update sweater" });
  }
};

// Delete sweater
export const deleteSweater = async (req, res) => {
  try {
    console.log("Deleting sweater:", req.params.id);
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn("Invalid sweater ID:", req.params.id);
      return res.status(400).json({ error: "Invalid sweater ID" });
    }

    const product = await sweatersProduct.findById(req.params.id);
    if (!product) {
      console.log("Sweater not found:", req.params.id);
      return res.status(404).json({ error: "Sweater not found" });
    }

    await product.deleteOne();
    console.log("Sweater deleted:", req.params.id);
    res.json({ message: "Sweater deleted successfully" });
  } catch (error) {
    console.error("Error deleting sweater:", error.message, error.stack);
    res.status(500).json({ error: "Failed to delete sweater" });
  }
};