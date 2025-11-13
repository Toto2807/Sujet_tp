import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

console.log('DEBUG env DATABASE_URL =', process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const c = await pool.connect();
    const r = await c.query('SELECT current_database() AS db, current_schema() AS schema, count(*)::int AS users_count FROM users');
    console.log('✅ PostgreSQL connecté — info:', r.rows[0]);
    c.release();
  } catch (err) {
    console.error('❌ Erreur de connexion ou requête test:', err.message || err);
  }
}

testConnection();

process.on('exit', () => {
  pool.end();
});
