import { pool } from '../server.js';

// Create users table
export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      firebase_uid VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) NOT NULL,
      display_name VARCHAR(100),
      profile_picture TEXT,
      bio TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      theme VARCHAR(20) DEFAULT 'dark',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_firebase_uid ON users(firebase_uid);
    CREATE INDEX IF NOT EXISTS idx_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_email ON users(email);
  `;

  try {
    await pool.query(query);
    console.log('✓ Users table created');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

// Create chats table
export const createChatsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS chats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_1_id, user_2_id)
    );

    CREATE INDEX IF NOT EXISTS idx_user_chats ON chats(user_1_id, user_2_id);
  `;

  try {
    await pool.query(query);
    console.log('✓ Chats table created');
  } catch (error) {
    console.error('Error creating chats table:', error);
  }
};

// Initialize all tables
export const initializeDatabase = async () => {
  try {
    await createUsersTable();
    await createChatsTable();
    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};
