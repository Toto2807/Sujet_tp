import bcrypt from "bcrypt";
import { pool } from "../config/db.postgres.js";

export class User {
    static async create({ username, email, password, role = "user" }) {
        const nHash = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashed = await bcrypt.hash(password, nHash);

        const result = await pool.query(
            `INSERT INTO users (username, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [username, email, hashed, role]
        );
        return result.rows[0];
    }

    static async read() {
        const result = await pool.query(
            `SELECT *
             FROM users`
        );
        return result.rows;
    }

    static async readById(id) {
        const result = await pool.query(
            `SELECT *
             FROM users
             WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async readByEmail(email) {
        const result = await pool.query(
            `SELECT *
             FROM users
             WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    }

    static async updateById(id, { username, email, role, isBanned }) {
        const result = await pool.query(
            `UPDATE users
             SET username = $1, email = $2, role = $3, is_banned = $4
             WHERE id = $5
             RETURNING *`,
            [username, email, role, isBanned, id]
        );
        return result.rows[0];
    }

    static async deleteById(id) {
        const result = await pool.query(
            `DELETE FROM users
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        return result.rowCount;
    }
}
