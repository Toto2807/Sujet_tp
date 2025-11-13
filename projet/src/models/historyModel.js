import {pool} from '../config/db.js';

class History {
  static async addOrUpdate(user_id, manga_id, last_chapter_id) {
    const query = `
      INSERT INTO history (user_id, manga_id, last_chapter_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, manga_id)
      DO UPDATE SET last_chapter_id = EXCLUDED.last_chapter_id, updated_at = now()
      RETURNING *;
    `;
    const values = [user_id, manga_id, last_chapter_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByUser(user_id) {
    const { rows } = await pool.query(
      'SELECT * FROM history WHERE user_id = $1 ORDER BY updated_at DESC',
      [user_id]
    );
    return rows;
  }

  static async delete(user_id, manga_id) {
    await pool.query(
      'DELETE FROM history WHERE user_id = $1 AND manga_id = $2',
      [user_id, manga_id]
    );
    return true;
  }
}

export default History;
