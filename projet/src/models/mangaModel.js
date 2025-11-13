import { pool } from '../config/db.js';

export const getAllManga = async () => {
  const res = await pool.query('SELECT * FROM manga ORDER BY title ASC');
  return res.rows;
};

export const getMangaById = async (id) => {
  const res = await pool.query('SELECT * FROM manga WHERE id=$1', [id]);
  return res.rows[0];
};

export const createManga = async ({ title, description, author, artist, tags, cover_url, published_at }) => {
  const res = await pool.query(
    `INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, description, author, artist, tags, cover_url, published_at]
  );
  return res.rows[0];
};
