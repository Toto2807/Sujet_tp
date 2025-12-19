import { pool } from "../config/db.postgres.js";

export class History {
    static async create({ userId, mangaId, lastChapterId }) {
        const result = await pool.query(
            `INSERT INTO histories (user_id, manga_id, last_chapter_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, mangaId, lastChapterId]
        );
        return result.rows[0];
    }

    static async read() {
        const result = await pool.query(
            `SELECT *
             FROM histories`
        );
        return result.rows;
    }

    static async readById(user_id) {
        const result = await pool.query(
            `SELECT *
             FROM histories
             WHERE user_id = $1`,
            [user_id]
        );
        return result.rows[0];
    }

    static async updateById(user_id, manga_id, { lastChapterId }) {
        const result = await pool.query(
            `UPDATE histories
             SET last_chapter_id = $1
             WHERE user_id = $2 AND manga_id = $3
             RETURNING *`,
            [lastChapterId, user_id, manga_id]
        );
        return result.rows[0];
    }

    static async deleteById(user_id, manga_id) {
        const result = await pool.query(
            `DELETE FROM histories
             WHERE user_id = $1 AND manga_id = $2`,
            [user_id, manga_id]
        );
        return result.rowCount;
    }
}
