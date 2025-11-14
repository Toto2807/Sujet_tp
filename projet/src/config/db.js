import dotenv from 'dotenv';
import pkg from 'pg';
dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function pgHealthcheck() {
  const c = await pool.connect();
  try {
    const r = await c.query(`select current_database() as db, current_schema() as schema`);
    return r.rows[0];
  } finally {
    c.release();
  }
}

process.on('exit', () => {
  pool.end();
});
