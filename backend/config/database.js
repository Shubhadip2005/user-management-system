const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "user-management",
  password: process.env.DB_PASSWORD || "123456",
  port: process.env.DB_PORT || 5432,
};

const db = new Client(dbConfig);

const connectDB = async () => {
  try {
    await db.connect();
    console.log('✅ PostgreSQL Database Connected Successfully!');
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`🏠 Host: ${dbConfig.host}:${dbConfig.port}`);
    return db;
  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
    console.error('💡 Make sure PostgreSQL is running and credentials are correct');
    process.exit(1);
  }
};

const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      age INTEGER CHECK (age >= 0 AND age <= 150),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(createUsersTable);
    console.log('✅ Users table ready');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
};

const initializeDatabase = async () => {
  await connectDB();
  await createTables();
};

module.exports = {
  db,
  dbConfig,
  connectDB,
  createTables,
  initializeDatabase
};