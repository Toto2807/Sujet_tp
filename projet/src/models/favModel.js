import {pool} from '../config/db.js';

export const getFavsByUser = async (user_id) => {
  const res = await pool.query('SELECT * FROM fav WHERE id_user=$1', [user_id]);
  return res.rows;
};

export const addFav = async (id_user, id_manga) => {
    const result = await pool.query(
      'INSERT INTO fav (id_user, id_manga) VALUES ($1, $2) RETURNING *',
      [id_user, id_manga]
    );
    return result.rows[0];
  };
  

export const removeFav = async (user_id, manga_id) => {
  await pool.query('DELETE FROM fav WHERE id_user=$1 AND id_manga=$2', [user_id, manga_id]);
};
