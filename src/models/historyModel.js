import { pool } from '../config/db.js';

export const HistoryModel = {
  async get(userId, mangaId) {
    const r = await pool.query(
      `select user_id, manga_id, last_chapter_id, updated_at
       from history
       where user_id = $1 and manga_id = $2`,
      [userId, mangaId]
    );
    return r.rows[0] || null;
  },

  async upsert(userId, mangaId, lastChapterId) {
    const r = await pool.query(
      `insert into history (user_id, manga_id, last_chapter_id, updated_at)
       values ($1,$2,$3, now())
       on conflict (user_id, manga_id)
       do update set last_chapter_id = excluded.last_chapter_id, updated_at = now()
       returning user_id, manga_id, last_chapter_id, updated_at`,
      [userId, mangaId, lastChapterId]
    );
    return r.rows[0];
  },

  async listByUser(userId) {
    const r = await pool.query(
      `select h.user_id, h.manga_id, h.last_chapter_id, h.updated_at,
              m.title, m.cover_url
       from history h
       join manga m on m.id = h.manga_id
       where h.user_id = $1
       order by h.updated_at desc`,
      [userId]
    );
    return r.rows;
  },

  async remove(userId, mangaId) {
    await pool.query(`delete from history where user_id = $1 and manga_id = $2`, [userId, mangaId]);
    return true;
  }
};
