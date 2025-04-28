import express from 'express';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Razorpay
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_EnyUqaRkfibT2I',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_here',
  });
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message, error.stack);
  throw new Error('Razorpay initialization failed');
}

// Create Order Endpoint
router.post('/create', async (req, res) => {
  try {
    const { amount, currency = 'INR', items, userName, contact, address, email, userId } = req.body;
    console.log('Received order data:', req.body);

    // Validate required fields
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required and must be greater than 0',
      });
    }

    if (!address || typeof address !== 'string' || address.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Shipping address is required',
      });
    }

    if (!contact || typeof contact !== 'string' || contact.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Contact number is required',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required and must not be empty',
      });
    }

    for (const item of items) {
      if (!item.productId || !item.title || !item.quantity || !item.price || !item.size || !item.color) {
        return res.status(400).json({
          success: false,
          error: 'Each item must have productId, title, size, color, quantity, and price',
        });
      }
    }

    // Create Razorpay order
    if (!razorpay) {
      throw new Error('Razorpay instance not initialized');
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    console.log('Creating Razorpay order with options:', options);
    const razorpayOrder = await razorpay.orders.create(options).catch((err) => {
      throw new Error(`Razorpay order creation failed: ${err.message}`);
    });

    // Save to database
    const newOrder = new Order({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      userId: userId || null,
      userName: userName || 'Guest',
      contact,
      address,
      email: email || null,
      items, // Items now include size and color
      status: 'created',
    });

    console.log('Saving order to MongoDB:', newOrder);
    await newOrder.save().catch((err) => {
      throw new Error(`Failed to save order: ${err.message}`);
    });

    // Emit new order event
    const io = req.app.get('socketio');
    if (io) {
      console.log('Emitting newOrder event:', newOrder);
      io.emit('newOrder', newOrder);
    } else {
      console.warn('Socket.IO not initialized');
    }

    res.status(201).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Order creation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Verify Payment Endpoint
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    console.log('Received verification data:', { razorpay_payment_id, razorpay_order_id });

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment verification data',
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret_here')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signature',
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      console.warn('Order not found for verification:', razorpay_order_id);
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    console.log('Order updated to paid:', updatedOrder);

    const io = req.app.get('socketio');
    if (io) {
      console.log('Emitting orderUpdated event:', updatedOrder);
      io.emit('orderUpdated', updatedOrder);
    } else {
      console.warn('Socket.IO not initialized');
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Payment verification error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Delete Order Endpoint
router.delete('/:razorpayOrderId', async (req, res) => {
  try {
    const { razorpayOrderId } = req.params;
    console.log('Received delete request for order:', razorpayOrderId);

    const deletedOrder = await Order.findOneAndDelete({ razorpayOrderId });
    if (!deletedOrder) {
      console.warn('Order not found for deletion:', razorpayOrderId);
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    console.log('Order deleted from MongoDB:', deletedOrder);

    const io = req.app.get('socketio');
    if (io) {
      console.log('Emitting orderDeleted event:', razorpayOrderId);
      io.emit('orderDeleted', razorpayOrderId);
    } else {
      console.warn('Socket.IO not initialized');
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Order deletion error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Order deletion failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get All Orders Endpoint (for AdminHome.jsx)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;