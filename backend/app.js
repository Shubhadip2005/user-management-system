const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration - Allow frontend to connect
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users'
    },
    documentation: {
      'POST /api/auth/register': 'Register new user',
      'POST /api/auth/login': 'Login user',
      'GET /api/auth/profile': 'Get current user profile (protected)',
      'GET /api/users': 'Get all users (protected)',
      'GET /api/users/:id': 'Get user by ID (protected)',
      'PUT /api/users/profile': 'Update profile (protected)',
      'DELETE /api/users/account': 'Delete account (protected)'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;