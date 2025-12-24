const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Middleware
app.use(cors());

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
    message: 'Welcome to User REST API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users'
    },
    documentation: {
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create new user (requires: name, email, age)',
      'PUT /api/users/:id': 'Update user (requires: name, email, age)',
      'PATCH /api/users/:id': 'Partial update user (optional: name, email, age)',
      'DELETE /api/users/:id': 'Delete user'
    }
  });
});

// API Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;