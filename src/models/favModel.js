import { pool } from '../config/db.js';

export const FavModel = {
  async listByUser(userId) {
    const r = await pool.query(
      `select m.id, m.title, m.cover_url
       from fav f
       join manga m on m.id = f.id_manga
       where f.id_user = $1
       order by m.title asc`,
      [userId]
    );
    return r.rows;
  },

  async add(userId, mangaId) {
    await pool.query(
      `insert into fav (id_user, id_manga)
       values ($1, $2)
       on conflict (id_user, id_manga) do nothing`,
      [userId, mangaId]
    );
    return true;
  },

  async remove(userId, mangaId) {
    await pool.query(`delete from fav where id_user = $1 and id_manga = $2`, [userId, mangaId]);
    return true;
  }
};
