import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
    host: process.env.DB_PG_HOST,
    user: process.env.DB_PG_USER,
    password: process.env.DB_PG_PASSWORD,
    database: process.env.DB_PG_DATABASE,
    port: process.env.DB_PG_PORT,
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error(`Failed to connect to PostgreSQL: ${err.message}`);
    } else {
        console.log("Successfully connected to PostgreSQL");
    }
});
