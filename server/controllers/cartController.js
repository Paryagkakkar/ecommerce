import CartItem from "../models/cartModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const newItem = new CartItem(req.body);
    await newItem.save();
    res.status(201).json({ message: "Item added to cart successfully!", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart", error });
  }
};

// Get all cart items
export const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
};

// Remove an item from cart
export const removeFromCart = async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart", error });
  }
};
