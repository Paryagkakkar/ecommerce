import jacketsProduct from "../models/jacketsModel.js";

// 📌 1️⃣ Get all products
export const getjackets = async (req, res) => {
  try {
    const products = await jacketsProduct.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching jackets:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 2️⃣ Get single product
export const getjacketsById = async (req, res) => {
  try {
    const product = await jacketsProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Jacket not found" });
    res.json(product);
  } catch (error) {
    console.error("Error fetching jacket by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 3️⃣ Create product (with file upload)
export const createjackets = async (req, res) => {
  try {
    const { title, price, size, color, category } = req.body;
    if (!title || !price || !size || !color || !category || !req.file) {
      return res.status(400).json({ error: "All fields are required, including image" });
    }
    if (parseFloat(price) <= 0) {
      return res.status(400).json({ error: "Price must be greater than 0" });
    }

    const newProduct = new jacketsProduct({
      title,
      price: parseFloat(price),
      size,
      color,
      category,
      image: `/uploads/${req.file.filename}`,
      type: "jacket", // Explicitly set type
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating jacket:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 4️⃣ Update product (with file upload)
export const updatejackets = async (req, res) => {
  try {
    console.log("Received update request:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { title, price, size, color, category } = req.body;
    const jacket = await jacketsProduct.findById(req.params.id);

    if (!jacket) {
      return res.status(404).json({ message: "Jacket not found" });
    }

    // Validate required fields if provided
    if (title !== undefined && !title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (price !== undefined && (!price || parseFloat(price) <= 0)) {
      return res.status(400).json({ error: "Price must be greater than 0" });
    }
    if (size !== undefined && !size) {
      return res.status(400).json({ error: "Size is required" });
    }
    if (color !== undefined && !color) {
      return res.status(400).json({ error: "Color is required" });
    }
    if (category !== undefined && !category) {
      return res.status(400).json({ error: "Category is required" });
    }

    jacket.title = title || jacket.title;
    jacket.price = price ? parseFloat(price) : jacket.price;
    jacket.size = size || jacket.size;
    jacket.color = color || jacket.color;
    jacket.category = category || jacket.category;
    jacket.type = "jacket"; // Ensure type is set

    if (req.file) {
      jacket.image = `/Uploads/${req.file.filename}`;
    }

    const updatedJacket = await jacket.save();
    res.json(updatedJacket); // Standardize response
  } catch (error) {
    console.error("Error updating jacket:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 5️⃣ Delete product
export const deletejackets = async (req, res) => {
  try {
    const product = await jacketsProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Jacket not found" });

    await product.deleteOne();
    res.json({ message: "Jacket deleted successfully" });
  } catch (error) {
    console.error("Error deleting jacket:", error);
    res.status(500).json({ error: error.message });
  }
};