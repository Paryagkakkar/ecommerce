import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Get cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add to cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, title, price, quantity, image } = req.body;
    const user = await User.findById(req.user.id);
    
    const cartItemIndex = user.cart.findIndex(item => item.productId === productId);
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, title, price, quantity, image });
    }
    
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove from cart (optional, from previous suggestion)
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.productId !== req.params.productId);
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;