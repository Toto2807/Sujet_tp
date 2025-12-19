import { pool } from "../config/db.postgres.js";

export class Manga {
    static async create({
        title,
        description,
        author,
        artist,
        tags,
        coverUrl,
    }) {
        const result = await pool.query(
            `INSERT INTO mangas (title, description, author, artist, tags, cover_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, description, author, artist, tags, coverUrl]
        );
        return result.rows[0];
    }

    static async read() {
        const result = await pool.query(
            `SELECT *
             FROM mangas`
        );
        return result.rows;
    }

    static async readById(id) {
        const result = await pool.query(
            `SELECT *
             FROM mangas
             WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async readByTitle(search) {
        const result = await pool.query(
            `SELECT *
             FROM mangas
             WHERE title ilike '%' || $1 || '%'
             ORDER BY title ASC`,
            [search]
        );
        return result.rows;
    }

    static async updateById(
        id,
        { title, description, author, artist, tags, coverUrl }
    ) {
        const result = await pool.query(
            `UPDATE mangas
             SET title = $1, description = $2, author = $3, artist = $4, tags = $5, cover_url = $6
             WHERE id = $7
             RETURNING *`,
            [title, description, author, artist, tags, coverUrl, id]
        );
        return result.rows[0];
    }

    static async deleteById(id) {
        const result = await pool.query(
            `DELETE FROM mangas
             WHERE id = $1`,
            [id]
        );
        return result.rowCount;
    }
}
