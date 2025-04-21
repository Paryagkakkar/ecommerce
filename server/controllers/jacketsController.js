import jacketsProduct from "../models/jacketsModel.js";

// 📌 1️⃣ Get all products
export const getjackets = async (req, res) => {
  try {
    const products = await jacketsProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 2️⃣ Get single product
export const getjacketsById = async (req, res) => {
  try {
    const product = await jacketsProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 3️⃣ Create product (with file upload)
export const createjackets = async (req, res) => {
  try {
    const { title, price, size, color, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new jacketsProduct({
      title,
      price,
      size,
      color,
      category,
      image,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error); // Add this line to log the error
    res.status(500).json({ error: error.message });
  }
};

// 📌 4️⃣ Update product (with file upload)
export const updatejackets = async (req, res) => {
  try {
    // Log the request and file information
    console.log("Received update request:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    // Destructure the fields from the request body
    const { title, price, size, color, category } = req.body;

    // Find the T-shirt by its ID in the database
    const jackets = await jacketsProduct.findById(req.params.id);

    // If the T-shirt isn't found, return a 404 error
    if (!jackets) {
      return res.status(404).json({ message: "T-Shirt not found" });
    }

    // Update the T-shirt fields (only if new values are provided)
    jackets.title = title || jackets.title;
    jackets.price = price || jackets.price;
    jackets.size = size || jackets.size;
    jackets.color = color || jackets.color;
    jackets.category = category || jackets.category;

    // If a new image is uploaded, update the image field
    if (req.file) {
      jackets.image = `/uploads/${req.file.filename}`;
    }

    // Save the updated T-shirt to the database
    const updatedjackets = await jackets.save();

    // Respond with the updated T-shirt
    res.json({ success: true, product: updatedjackets });
  } catch (error) {
    // Handle errors by sending a 500 error response
    console.error("❌ Error updating T-Shirt:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 5️⃣ Delete product
export const deletejackets = async (req, res) => {
  try {
    const product = await jacketsProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
