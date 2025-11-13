// import dotenv from 'dotenv';
// import app from './app.js';

// dotenv.config();

// const PORT = process.env.PORT || 3000;

// const server = app.listen(PORT, () => {
//   console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
// });


// process.on('SIGINT', () => {
//   console.log('SIGINT reçu — arrêt du serveur...');
//   server.close(() => {
//     console.log('Serveur arrêté');
//     process.exit(0);
//   });
// });


import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import mangaRoutes from './routes/mangaRoutes.js'
import favRoutes from './routes/favRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', mangaRoutes);
app.use('/api', favRoutes);
app.use('/api', historyRoutes);


async function start() {
  try {
    await prisma.$connect();
    console.log(`✅ PostgreSQL connecté : ${process.env.DATABASE_URL}`);
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur de connexion à PostgreSQL :', err);
  }
}

start();
