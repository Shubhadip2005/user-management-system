const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "user-management",
  password: process.env.DB_PASSWORD || "123456",
  port: process.env.DB_PORT || 5432,
};

async function setupDatabase() {
  const client = new Client(dbConfig);

  try {
    console.log('🔄 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL!');

    console.log('🔄 Dropping existing users table (if exists)...');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('✅ Old table dropped');

    console.log('🔄 Creating users table...');
    const createTableQuery = `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        age INTEGER CHECK (age >= 0 AND age <= 150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTableQuery);
    console.log('✅ Users table created successfully!');

    console.log('🔄 Inserting sample users with hashed passwords...');
    
    // Hash passwords for sample users
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password123', 10);
    const password3 = await bcrypt.hash('password123', 10);

    const insertQuery = `
      INSERT INTO users (name, email, password, age) VALUES
        ('John Doe', 'john@example.com', $1, 30),
        ('Jane Smith', 'jane@example.com', $2, 25),
        ('Bob Johnson', 'bob@example.com', $3, 35)
      ON CONFLICT (email) DO NOTHING;
    `;
    await client.query(insertQuery, [password1, password2, password3]);
    console.log('✅ Sample users inserted!');
    console.log('📧 Sample login: john@example.com / password123');

    const result = await client.query('SELECT COUNT(*) as count FROM users;');
    console.log(`✅ Total users in database: ${result.rows[0].count}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Database Information:');
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port}`);
    console.log('\n🔐 Sample User Credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('\n✨ You can now start the server with: npm start');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Make sure PostgreSQL is installed and running');
    console.error('   2. Check if database "user-management" exists (create it if not)');
    console.error('   3. Verify credentials in .env file');
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n👋 Database connection closed');
  }
}

setupDatabase();