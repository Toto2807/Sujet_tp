import { pool } from '../config/db.js';

export const MangaModel = {
  async list({ search }) {
    if (search) {
      const r = await pool.query(
        `select id, title, description, author, artist, tags, cover_url, published_at
         from manga
         where title ilike '%' || $1 || '%'
         order by title asc`,
        [search]
      );
      return r.rows;
    }
    const r = await pool.query(
      `select id, title, description, author, artist, tags, cover_url, published_at
       from manga
       order by title asc`
    );
    return r.rows;
  },

  async get(id) {
    const r = await pool.query(
      `select id, title, description, author, artist, tags, cover_url, published_at
       from manga
       where id = $1`,
      [id]
    );
    return r.rows[0] || null;
  },

  async create(payload) {
    const { title, description, author, artist, tags, cover_url, published_at } = payload;
    const r = await pool.query(
      `insert into manga (title, description, author, artist, tags, cover_url, published_at)
       values ($1,$2,$3,$4,$5,$6,$7)
       returning id, title, description, author, artist, tags, cover_url, published_at`,
      [title, description ?? null, author ?? null, artist ?? null, tags ?? null, cover_url ?? null, published_at ?? null]
    );
    return r.rows[0];
  },

  async update(id, payload) {
    const { title, description, author, artist, tags, cover_url, published_at } = payload;
    const r = await pool.query(
      `update manga
       set title = coalesce($2, title),
           description = coalesce($3, description),
           author = coalesce($4, author),
           artist = coalesce($5, artist),
           tags = coalesce($6, tags),
           cover_url = coalesce($7, cover_url),
           published_at = coalesce($8, published_at)
       where id = $1
       returning id, title, description, author, artist, tags, cover_url, published_at`,
      [id, title, description, author, artist, tags, cover_url, published_at]
    );
    return r.rows[0] || null;
  },

  async remove(id) {
    await pool.query(`delete from manga where id = $1`, [id]);
    return true;
  }
};
