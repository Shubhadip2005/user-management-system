const User = require('../models/User');

class UserService {
  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Add some initial data for testing
    this.seedData();
  }

  seedData() {
    const sampleUsers = [
      { name: 'John Doe', email: 'john@example.com', age: 30 },
      { name: 'Jane Smith', email: 'jane@example.com', age: 25 },
      { name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
    ];

    sampleUsers.forEach(userData => {
      this.createUser(userData);
    });
  }

  // Create a new user
  createUser(userData) {
    const validation = User.validate(userData);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if email already exists
    for (let user of this.users.values()) {
      if (user.email.toLowerCase() === userData.email.toLowerCase()) {
        throw new Error('Email already exists');
      }
    }

    const user = new User(
      this.currentId++,
      userData.name.trim(),
      userData.email.toLowerCase().trim(),
      userData.age
    );

    this.users.set(user.id, user);
    return user;
  }

  // Get all users
  getAllUsers() {
    return Array.from(this.users.values());
  }

  // Get user by ID
  getUserById(id) {
    const user = this.users.get(parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Update user
  updateUser(id, userData) {
    const user = this.getUserById(id);

    // Validate updated data
    const dataToValidate = {
      name: userData.name !== undefined ? userData.name : user.name,
      email: userData.email !== undefined ? userData.email : user.email,
      age: userData.age !== undefined ? userData.age : user.age
    };

    const validation = User.validate(dataToValidate);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if email is being changed and if it already exists
    if (userData.email && userData.email.toLowerCase() !== user.email) {
      for (let existingUser of this.users.values()) {
        if (existingUser.id !== user.id && 
            existingUser.email.toLowerCase() === userData.email.toLowerCase()) {
          throw new Error('Email already exists');
        }
      }
    }

    // Update fields
    if (userData.name !== undefined) {
      user.name = userData.name.trim();
    }
    if (userData.email !== undefined) {
      user.email = userData.email.toLowerCase().trim();
    }
    if (userData.age !== undefined) {
      user.age = userData.age;
    }

    user.updatedAt = new Date();
    return user;
  }

  // Delete user
  deleteUser(id) {
    const user = this.getUserById(id);
    this.users.delete(user.id);
    return user;
  }

  // Get users count
  getUsersCount() {
    return this.users.size;
  }
}

// Export singleton instance
module.exports = new UserService();