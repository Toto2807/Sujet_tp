import { pool } from '../config/db.js';

export const UserModel = {
  async getAll() {
    const r = await pool.query('select id, username, email, role, is_ban from users order by created_at desc nulls last');
    return r.rows;
  },

  async getById(id) {
    const r = await pool.query('select id, username, email, role, is_ban, password from users where id = $1', [id]);
    return r.rows[0] || null;
  },

  async getPublicById(id) {
    const r = await pool.query('select id, username, email, role, is_ban from users where id = $1', [id]);
    return r.rows[0] || null;
  },

  async findByEmail(email) {
    const r = await pool.query('select id, username, email, role, is_ban, password from users where email = $1', [email]);
    return r.rows[0] || null;
  },

  async create({ username, email, password, role = 'user' }) {
    const r = await pool.query(
      `insert into users (username, email, password, role)
       values ($1,$2,$3,$4)
       returning id, username, email, role, is_ban, password`,
      [username, email, password, role]
    );
    return r.rows[0];
  },

  async updateMe(id, { username, email }) {
    const r = await pool.query(
      `update users
       set username = coalesce($2, username),
           email = coalesce($3, email)
       where id = $1
       returning id, username, email, role, is_ban`,
      [id, username, email]
    );
    return r.rows[0] || null;
  },

  async deleteById(id) {
    await pool.query('delete from users where id = $1', [id]);
    return true;
  },

  async updateRole(id, role) {
  const r = await pool.query(
    `update users set role = $2 where id = $1 returning id, username, email, role`,
    [id, role]
  );
  return r.rows[0] || null;
},

async updateBan(id, is_ban) {
  const r = await pool.query(
    `update users
     set is_ban = $2,
         updated_at = now()
     where id = $1
     returning id, username, email, role, is_ban`,
    [id, is_ban]
  );
  return r.rows[0] || null;
}


};
