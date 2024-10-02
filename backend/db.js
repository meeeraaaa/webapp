// backend/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config(); //  env vars

// pool of connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
