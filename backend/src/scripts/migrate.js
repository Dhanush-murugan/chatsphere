import { pool } from '../server.js';
import { initializeDatabase } from '../config/database.js';

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Initialize all tables
    await initializeDatabase();
    
    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
