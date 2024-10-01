// backend/db.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); //  env vars

// pool of connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
