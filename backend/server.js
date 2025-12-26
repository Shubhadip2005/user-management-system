require('dotenv').config();
const app = require('./app');
const { initializeDatabase } = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║   User Management System - Backend API Started         ║
╠════════════════════════════════════════════════════════╣
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
║  Port: ${PORT}                                            ║
║  Database: PostgreSQL (${process.env.DB_NAME || 'user-management'})                ║
║  Backend URL: http://localhost:${PORT}                    ║
║  Health: http://localhost:${PORT}/health                  ║
║  Auth API: http://localhost:${PORT}/api/auth              ║
║  Users API: http://localhost:${PORT}/api/users            ║
╠════════════════════════════════════════════════════════╣
║  🔐 Sample Login:                                      ║
║  Email: john@example.com                               ║
║  Password: password123                                 ║
╚════════════════════════════════════════════════════════╝
      `);
    });

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

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();