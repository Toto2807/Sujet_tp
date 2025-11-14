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


const isDev = process.env.NODE_ENV !== 'production';

app.use(
  helmet({
    hsts: isDev ? false : { maxAge: 31536000, includeSubDomains: true },
    contentSecurityPolicy: isDev ? false : undefined,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(' ') || '*' }));
app.use(morgan('dev'));
app.use(apiLimiter);

app.get('/', (req, res) => res.json({ status: 'ok' }));

const docsDir = path.resolve(process.cwd(), 'src', 'docs');
const swaggerPath = path.join(docsDir, 'swagger.json');

console.log('DEBUG Swagger -> docsDir:', docsDir);
console.log('DEBUG Swagger -> swaggerPath:', swaggerPath);
console.log('DEBUG Swagger -> exists(docsDir):', fs.existsSync(docsDir));
console.log('DEBUG Swagger -> exists(swagger.json):', fs.existsSync(swaggerPath));

app.use('/docs', express.static(docsDir, { extensions: ['json', 'yaml', 'yml'] }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(null, { swaggerUrl: '/docs/swagger.json' }));


app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', mangaRoutes);
app.use('/api', favRoutes);
app.use('/api', historyRoutes);
app.use('/api', chapterRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
