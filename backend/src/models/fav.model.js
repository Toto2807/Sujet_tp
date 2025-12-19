import { pool } from "../config/db.postgres.js";

export class Fav {
    static async create({ userId, mangaId }) {
        const result = await pool.query(
            `INSERT INTO favs (user_id, manga_id)
             VALUES ($1, $2)
             RETURNING *`,
            [userId, mangaId]
        );
        return result.rows[0];
    }

    static async read() {
        const result = await pool.query(
            `SELECT *
             FROM favs`
        );
        return result.rows;
    }

    static async readById(id) {
        const result = await pool.query(
            `SELECT *
             FROM favs
             WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async readByUserId(id) {
        const result = await pool.query(
            `SELECT m.id, m.title, m.cover_url
             FROM favs f
             JOIN mangas m ON m.id = f.id_manga
             WHERE f.id_user = $1
             ORDER BY m.title ASC`,
            [id]
        );
        return result.rows;
    }

    static async updateById(id, { userId, mangaId }) {
        const result = await pool.query(
            `UPDATE favs
             SET user_id = $1, manga_id = $2
             WHERE id = $3
             RETURNING *`,
            [userId, mangaId, id]
        );
        return result.rows[0];
    }

    static async deleteById(id) {
        const result = await pool.query(
            `DELETE FROM favs
             WHERE id = $1`,
            [id]
        );
        return result.rowCount;
    }
}
