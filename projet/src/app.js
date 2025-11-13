import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import mangaRoutes from './routes/mangaRoutes.js';
import favRoutes from './routes/favRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';

import { apiLimiter } from './middlewares/rateLimiter.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(' ') || '*' }));
app.use(morgan('dev'));
app.use(apiLimiter);

app.get('/', (req, res) => res.json({ status: 'ok' }));

let swaggerDoc = null;
try {
  const p = path.resolve('src/docs/swagger.json');
  if (fs.existsSync(p)) swaggerDoc = JSON.parse(fs.readFileSync(p, 'utf-8'));
} catch (_) {}
if (swaggerDoc) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', mangaRoutes);
app.use('/api', favRoutes);
app.use('/api', historyRoutes);
app.use('/api', chapterRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
