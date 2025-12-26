const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// All routes are protected (require authentication)

// GET /api/users - Get all users
router.get('/', authMiddleware, userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', authMiddleware, userController.getUserById);

// PUT /api/users/profile - Update current user's profile
router.put('/profile', authMiddleware, userController.updateProfile);

// DELETE /api/users/account - Delete current user's account
router.delete('/account', authMiddleware, userController.deleteAccount);

module.exports = router;