import { pool } from "../config/db.postgres.js";

export class History {
    static async create({ user_id, manga_id, last_chapter_id }) {
        const result = await pool.query(
            `INSERT INTO histories (user_id, manga_id, last_chapter_id, updated_at)
             VALUES ($1, $2, $3, now())
             RETURNING *`,
            [user_id, manga_id, last_chapter_id]
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

    static async readById(id) {
        const result = await pool.query(
            `SELECT *
             FROM histories
             WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async readByUserId(id) {
        const result = await pool.query(
            `SELECT h.user_id, h.manga_id, h.last_chapter_id, h.updated_at, m.title, m.cover_url
             FROM histories h
             JOING mangas m ON m.id = h.manga_id
             WHERE h.user_id = $1
             ORDER BY h.updated_at DESC`,
            [id]
        );
        return result.rows;
    }

    static async updateById(id, { last_chapter_id }) {
        const result = await pool.query(
            `UPDATE histories
             SET last_chapter_id = $1
             WHERE id = $2
             RETURNING *`,
            [last_chapter_id, id]
        );
        return result.rows[0];
    }

    static async deleteById(id) {
        result = await pool.query(
            `DELETE FROM histories
             WHERE id = $1`,
            [id]
        );
        return result.rowCount;
    }
}
