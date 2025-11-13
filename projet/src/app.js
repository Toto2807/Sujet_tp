// import express from "express";
// import cors from "cors";
// // import swaggerUi from "swagger-ui-express";
// // import { swaggerSpec } from "./swagger.js";
// // import booksRouter from "./routes/books.routes.js";

// const app = express();

// app.use(cors());

// app.use(express.json());

// app.get("/", (req, res) => 
//     res.json({ message: "API OK" })
// );

// // app.use("/api/books", booksRouter);

// // app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// export default app;


import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { pool } from './config/db.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(' ') || '*'
}));


app.get('/', (req, res) => res.send('API en ligne 🚀'));


app.use('/api/users', userRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
});

export default app;
