import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import mangaRoutes from "./routes/manga.routes.js";
import favRoutes from "./routes/fav.routes.js";
import historyRoutes from "./routes/history.routes.js";
import chapterRoutes from "./routes/chatper.routes.js";

import { apiLimiter } from "./middlewares/rate-limiter.js";
import { errorHandler } from "./middlewares/error-handler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CORS_ORIGINS?.split(" ") || "http://localhost:3000",
        credentials: true,
    })
);
app.use(morgan("dev"));
app.use(apiLimiter);

app.get("/", (req, res) => res.json({ status: "ok" }));

let swaggerDoc = null;
try {
    const p = path.resolve("src/docs/swagger.json");
    if (fs.existsSync(p)) swaggerDoc = JSON.parse(fs.readFileSync(p, "utf-8"));
} catch (_) {}
if (swaggerDoc) {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mangas", mangaRoutes);
app.use("/api/favs", favRoutes);
app.use("/api/histories", historyRoutes);
app.use("/api/chapters", chapterRoutes);

app.use(errorHandler);

export default app;
