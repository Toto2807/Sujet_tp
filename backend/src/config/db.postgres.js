import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
    host: process.env.DB_PG_HOST,
    user: process.env.DB_PG_USER,
    password: process.env.DB_PG_PASSWORD,
    database: process.env.DB_PG_DATABASE,
    port: Number(process.env.DB_PG_PORT),
});

export const connectPostgres = async () => {
    await pool.query("SELECT 1");
};
