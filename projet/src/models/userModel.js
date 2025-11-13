// import { pool } from '../config/db.js';

// export const UserModel = {
//   async getAll() {
//     const result = await pool.query('SELECT id, username, email, role, is_ban FROM users');
//     return result.rows;
//   },

//   async getById(id) {
//     const result = await pool.query('SELECT id, username, email, role, is_ban FROM users WHERE id = $1', [id]);
//     return result.rows[0];
//   }
// };


import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

export const UserModel = {
  async findAll({ limit = 100, offset = 0 } = {}) {
    const q = `SELECT id, username, email, role, is_ban FROM users ORDER BY username LIMIT $1 OFFSET $2`;
    const res = await pool.query(q, [limit, offset]);
    return res.rows;
  },

  async countAll() {
    const q = `SELECT count(*)::int AS total FROM users`;
    const res = await pool.query(q);
    return res.rows[0].total;
  },

  async findById(id) {
    const q = `SELECT id, username, email, role, is_ban FROM users WHERE id = $1`;
    const res = await pool.query(q, [id]);
    return res.rows[0] || null;
  },

  async findByUsernameOrEmail(usernameOrEmail) {
    const q = `SELECT * FROM users WHERE username = $1 OR email = $1`;
    const res = await pool.query(q, [usernameOrEmail]);
    return res.rows[0] || null;
  },

  async create({ id = null, username, email, password, role = 'user' }) {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    if (id) {
      const q = `INSERT INTO users (id, username, email, password, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, username, email, role, is_ban`;
      const res = await pool.query(q, [id, username, email, hashed, role]);
      return res.rows[0];
    } else {
      const q = `INSERT INTO users (username, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, username, email, role, is_ban`;
      const res = await pool.query(q, [username, email, hashed, role]);
      return res.rows[0];
    }
  },

  async updateById(id, { username, email }) {
    const q = `UPDATE users SET username = COALESCE($2, username), email = COALESCE($3, email) WHERE id = $1 RETURNING id, username, email, role, is_ban`;
    const res = await pool.query(q, [id, username, email]);
    return res.rows[0] || null;
  },

  async deleteById(id) {
    const q = `DELETE FROM users WHERE id = $1`;
    await pool.query(q, [id]);
    return true;
  }
};
