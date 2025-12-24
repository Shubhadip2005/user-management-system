require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║      User REST API Server Started          ║
╠════════════════════════════════════════════╣
║  Environment: ${process.env.NODE_ENV || 'development'}                  ║
║  Port: ${PORT}                                ║
║  URL: http://localhost:${PORT}                ║
║  Health: http://localhost:${PORT}/health      ║
║  API: http://localhost:${PORT}/api/users      ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});