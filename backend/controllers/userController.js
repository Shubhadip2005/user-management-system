const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserController {
  // Get all users (Admin functionality)
  async getAllUsers(req, res) {
    try {
      const query = 'SELECT id, name, email, age, created_at, updated_at FROM users ORDER BY id ASC;';
      const result = await db.query(query);
      
      res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const query = 'SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = $1;';
      const result = await db.query(query, [parseInt(req.params.id)]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }

  // Update current user's profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, email, age, currentPassword, newPassword } = req.body;

      // Get current user data
      const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'User not found'
        });
      }

      const user = userResult.rows[0];

      // Build dynamic update query
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (name !== undefined && name.trim() !== '') {
        updates.push(`name = $${paramCount}`);
        values.push(name.trim());
        paramCount++;
      }

      if (email !== undefined && email.trim() !== '') {
        // Check if email is already taken by another user
        const emailCheck = await db.query(
          'SELECT id FROM users WHERE email = $1 AND id != $2',
          [email.toLowerCase().trim(), userId]
        );

        if (emailCheck.rows.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Email already exists'
          });
        }

        updates.push(`email = $${paramCount}`);
        values.push(email.toLowerCase().trim());
        paramCount++;
      }

      if (age !== undefined) {
        if (age < 0 || age > 150) {
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Age must be between 0 and 150'
          });
        }
        updates.push(`age = $${paramCount}`);
        values.push(age);
        paramCount++;
      }

      // Handle password change
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Current password is required to change password'
          });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Current password is incorrect'
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updates.push(`password = $${paramCount}`);
        values.push(hashedPassword);
        paramCount++;
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'No fields to update'
        });
      }

      // Add updated_at timestamp
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userId);

      const query = `
        UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, name, email, age, created_at, updated_at;
      `;

      const result = await db.query(query, values);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }

  // Delete user account
  async deleteAccount(req, res) {
    try {
      const userId = req.user.id;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Password is required to delete account'
        });
      }

      // Verify password
      const userResult = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'User not found'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, userResult.rows[0].password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Incorrect password'
        });
      }

      // Delete user
      const query = 'DELETE FROM users WHERE id = $1 RETURNING id, name, email;';
      const result = await db.query(query, [userId]);

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }
}

module.exports = new UserController();