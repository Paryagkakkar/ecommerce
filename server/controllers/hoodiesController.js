import hoodiesProduct from "../models/hoodiesModel.js";

// 📌 1️⃣ Get all products
export const gethoodies = async (req, res) => {
  try {
    const products = await hoodiesProduct.find();
    console.log("Backend - Fetched hoodies:", products); // Debug log
    res.json(products);
  } catch (error) {
    console.error("Backend - Error fetching hoodies:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 2️⃣ Get single product
export const gethoodiesById = async (req, res) => {
  try {
    const product = await hoodiesProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    console.log("Backend - Fetched hoodie by ID:", product); // Debug log
    res.json(product);
  } catch (error) {
    console.error("Backend - Error fetching hoodie by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 3️⃣ Create product (with file upload)
export const createhoodies = async (req, res) => {
  try {
    const { title, price, size, color, category, type } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    
    console.log("Backend - Creating hoodie with data:", { title, price, size, color, category, type, image }); // Debug log

    const newProduct = new hoodiesProduct({
      title,
      price,
      size,
      color,
      category,
      type: type || "hoodie", // Use provided type or default to "hoodie"
      image,
    });
    await newProduct.save();
    console.log("Backend - Created hoodie:", newProduct); // Debug log
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Backend - Error creating hoodie:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 4️⃣ Update product (with file upload)
export const updatehoodies = async (req, res) => {
  try {
    console.log("Backend - Update request:", req.params.id, req.body, req.file); // Debug log

    const { title, price, size, color, category, type } = req.body;
    const hoodie = await hoodiesProduct.findById(req.params.id);

    if (!hoodie) {
      return res.status(404).json({ message: "Hoodie not found" });
    }

    // Update fields if provided
    hoodie.title = title || hoodie.title;
    hoodie.price = price || hoodie.price;
    hoodie.size = size || hoodie.size;
    hoodie.color = color || hoodie.color;
    hoodie.category = category || hoodie.category;
    hoodie.type = type || hoodie.type || "hoodie"; // Update type if provided, else keep existing or default
    if (req.file) {
      hoodie.image = `/uploads/${req.file.filename}`;
    }

    const updatedHoodie = await hoodie.save();
    console.log("Backend - Updated hoodie:", updatedHoodie); // Debug log
    res.json({ success: true, product: updatedHoodie });
  } catch (error) {
    console.error("Backend - Error updating hoodie:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 5️⃣ Delete product
export const deletehoodies = async (req, res) => {
  try {
    const product = await hoodiesProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    console.log("Backend - Deleted hoodie:", req.params.id); // Debug log
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Backend - Error deleting hoodie:", error);
    res.status(500).json({ error: error.message });
  }
};