import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import blazerRoutes from './routers/blazersRoutes.js';
import shirtRoutes from './routers/shirtRoutes.js';
import hoodieRoutes from './routers/hoodiesRoutes.js';
import sweaterRoutes from './routers/sweatersRoutes.js';
import jacketRoutes from './routers/jacketRoutes.js';
import orderRoutes from './routers/order.js';
import userRoutes from './routers/userRoutes.js';
import authRoutes from './routers/authRoutes.js';
import cartRoutes from './routers/cartRoutes.js';
import uploadRoutes from './routers/uploadRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Set socketio on app for routes to access
app.set('socketio', io);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));
app.use('/Uploads', express.static('public/Uploads'));

app.use((req, res, next) => {
  console.log(`📡 Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/blazers', blazerRoutes);
app.use('/api/shirts', shirtRoutes);
app.use('/api/hoodies', hoodieRoutes);
app.use('/api/sweaters', sweaterRoutes);
app.use('/api/jackets', jacketRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('✅ Socket.IO client connected:', socket.id);

  socket.on('requestInitialOrders', async () => {
    try {
      const Order = mongoose.model('Order');
      const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
      socket.emit('initialOrders', orders);
    } catch (error) {
      console.error('❌ Error sending initial orders:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket.IO client disconnected:', socket.id);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message, err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
});