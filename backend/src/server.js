import "dotenv/config";
import app from "./app.js";
import { connectPostgres } from "./config/db.postgres.js";
import { connectMongo } from "./config/db.mongo.js";

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await Promise.all([connectPostgres(), connectMongo()]);
        console.log("Databases connected successfully");

        app.listen(PORT, () => {
            console.log(`API is online at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error(`Initialization failed: ${err.message}`);
        process.exit(1);
    }
}

start();
