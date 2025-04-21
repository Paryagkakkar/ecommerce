import TShirtProduct from "../models/TShirtModel.js";

// Verify model import
if (!TShirtProduct) {
  console.error("Error: TShirtProduct model not loaded correctly");
  process.exit(1);
}

// 📌 1️⃣ Get all products
export const getTshirts = async (req, res) => {
  try {
    const products = await TShirtProduct.find();
    console.log('Fetched T-Shirts:', products); // Debug API response
    res.json(products);
  } catch (error) {
    console.error("Error fetching t-shirts:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 2️⃣ Get single product
export const getTshirtsById = async (req, res) => {
  try {
    const product = await TShirtProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    console.log('Fetched T-Shirt by ID:', product); // Debug response
    res.json(product);
  } catch (error) {
    console.error("Error fetching t-shirt by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 3️⃣ Create product (with file upload)
export const createTshirts = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { title, price, size, color, category } = req.body;
    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = `/uploads/${req.file.filename}`;
    console.log('Saved image path:', image); // Debug image path

    const newProduct = new TShirtProduct({
      title,
      price: parseFloat(price),
      size: size || "",
      color: color || "",
      category: category || "",
      image,
    });

    const savedProduct = await newProduct.save();
    console.log('Saved T-Shirt:', savedProduct); // Debug saved document
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating t-shirt:", error);
    if (error.message.includes("Only images are allowed")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// 📌 4️⃣ Update product (with file upload)
export const updateTshirts = async (req, res) => {
  try {
    console.log("Update request for ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { title, price, size, color, category } = req.body;
    const tshirt = await TShirtProduct.findById(req.params.id);

    if (!tshirt) {
      return res.status(404).json({ message: "T-Shirt not found" });
    }

    tshirt.title = title || tshirt.title;
    tshirt.price = price ? parseFloat(price) : tshirt.price;
    tshirt.size = size || tshirt.size;
    tshirt.color = color || tshirt.color;
    tshirt.category = category || tshirt.category;
    if (req.file) {
      const image = `/uploads/${req.file.filename}`;
      console.log('Updated image path:', image); // Debug image path
      tshirt.image = image;
    }

    const updatedTShirt = await tshirt.save();
    console.log('Updated T-Shirt:', updatedTShirt); // Debug updated document
    res.json({ success: true, product: updatedTShirt });
  } catch (error) {
    console.error("Error updating t-shirt:", error);
    if (error.message.includes("Only images are allowed")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// 📌 5️⃣ Delete product
export const deleteTshirts = async (req, res) => {
  try {
    const product = await TShirtProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    console.log('Deleted T-Shirt ID:', req.params.id); // Debug deletion
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting t-shirt:", error);
    res.status(500).json({ error: error.message });
  }
};