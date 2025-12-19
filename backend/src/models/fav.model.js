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

    static async readById(user_id, manga_id) {
        const result = await pool.query(
            `SELECT *
             FROM favs
             WHERE user_id = $1 AND manga_id = $2`,
            [user_id, manga_id]
        );
        return result.rows[0];
    }

    static async updateById(user_id, manga_id, { userId, mangaId }) {
        const result = await pool.query(
            `UPDATE favs
             SET user_id = $1, manga_id = $2
             WHERE user_id = $3 AND manga_id = $4
             RETURNING *`,
            [userId, mangaId, user_id, manga_id]
        );
        return result.rows[0];
    }

    static async deleteById(user_id, manga_id) {
        const result = await pool.query(
            `DELETE FROM favs
             WHERE user_id = $1 AND manga_id = $2`,
            [user_id, manga_id]
        );
        return result.rowCount;
    }
}
