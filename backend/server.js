/**
 * Bharat Airways - Backend Server
 * Main Express application entry point
 * Initializes middleware, routes, and starts the server
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server: SocketIO } = require('socket.io');

// Route imports
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware imports
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

// Database initialization
const { initializeDatabase } = require('./database/initializeDb');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io for real-time updates
const io = new SocketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// ==================== MIDDLEWARE ====================

// CORS Configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
const allowedOrigins = (process.env.CORS_ORIGIN || `${frontendUrl},http://localhost:5173`).split(',').map((origin) => origin.trim())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS policy blocked request from origin ${origin}`), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files (boarding pass PDF)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware (basic)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Bharat Airways backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/flights', flightRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Bharat Airways Flight Booking System API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      flights: '/flights',
      bookings: '/bookings',
      payments: '/payments',
      admin: '/admin',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.path
  });
});

// ==================== SOCKET.IO SETUP ====================

// Real-time seat availability updates
io.on('connection', (socket) => {
  console.log(`[Socket.io] User connected: ${socket.id}`);

  // Join flight room for real-time seat updates
  socket.on('join-flight', (flightId) => {
    socket.join(`flight-${flightId}`);
    console.log(`[Socket.io] User joined flight-${flightId}`);
  });

  // Emit seat updates to all connected clients
  socket.on('seat-reserved', (flightId, seatData) => {
    io.to(`flight-${flightId}`).emit('seat-updated', seatData);
    console.log(`[Socket.io] Seat updated on flight-${flightId}`);
  });

  // Leave flight room
  socket.on('leave-flight', (flightId) => {
    socket.leave(`flight-${flightId}`);
    console.log(`[Socket.io] User left flight-${flightId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`[Socket.io] User disconnected: ${socket.id}`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`[Socket.io] Error:`, error);
  });
});

// ==================== ERROR HANDLING ====================

// Global error handler (must be last)
app.use(errorHandler);

// ==================== SERVER STARTUP ====================

const PORT = process.env.PORT || 5000;

// Start server with database initialization
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    server.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════╗');
      console.log('║     Bharat Airways Flight Booking     ║');
      console.log('║           Backend Server              ║');
      console.log('╚════════════════════════════════════════╝');
      console.log('');
      console.log(`✈️  Server running on port: ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`📊 Node Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: SQLite (airline_booking.db)`);
      console.log('');
      console.log('Endpoints:');
      console.log(`  • GET  http://localhost:${PORT}/health`);
      console.log(`  • POST http://localhost:${PORT}/auth/login`);
      console.log(`  • GET  http://localhost:${PORT}/flights/search`);
      console.log(`  • POST http://localhost:${PORT}/bookings`);
      console.log('');
      console.log('Ready to accept connections...');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
module.exports.io = io;
