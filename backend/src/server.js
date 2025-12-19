import dotenv from "dotenv";
import app from "./app.js";
import { pool } from "./config/db.postgres.js";
import { connectMongo } from "./config/db.mongo.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        const pgInfo = await pgHealthcheck();
        console.log("✅ PostgreSQL connecté:", pgInfo);
    } catch (e) {
        console.error("❌ PostgreSQL KO:", e && e.message ? e.message : e);
    }

    try {
        const mongo = await connectMongo(process.env.MONGO_URL);
        console.log("✅ Mongo connecté:", mongo.name);
    } catch (e) {
        console.error("❌ Mongo KO:", e && e.message ? e.message : e);
    }

    app.listen(PORT, () => {
        console.log(`🚀 API en ligne sur http://localhost:${PORT}`);
    });
}

start();
