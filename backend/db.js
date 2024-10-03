// backend/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config(); //  env vars

// pool of connections
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

//export default pool;
export default prisma;
