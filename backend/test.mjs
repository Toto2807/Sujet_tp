import express from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import fs from 'node:fs';
import path from 'node:path';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3001;


const isDev = process.env.NODE_ENV !== 'production';
app.use(
  helmet({
    hsts: isDev ? false : { maxAge: 31536000, includeSubDomains: true },
    contentSecurityPolicy: isDev ? false : undefined,
  })
);

app.use(express.json());
app.use(morgan('dev'));

const docsDir = path.resolve(process.cwd(), 'src', 'docs');
const swaggerJsonPath = path.join(docsDir, 'swagger.json');

const fallbackSwagger = {
  openapi: '3.0.3',
  info: {
    title: 'Test Swagger - Minimal',
    version: '1.0.0',
    description: 'Spec minimale de test pour vérifier Swagger UI'
  },
  servers: [{ url: `http://localhost:${PORT}/api` }],
  paths: {
    '/ping': {
      get: {
        summary: 'Ping',
        responses: {
          '200': {
            description: 'pong',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string' } } }
              }
            }
          }
        }
      }
    }
  }
};

let swaggerDoc = null;

try {
  if (fs.existsSync(swaggerJsonPath)) {
    const raw = fs.readFileSync(swaggerJsonPath, 'utf-8');
    swaggerDoc = JSON.parse(raw);
    console.log('✅ swagger.json chargé depuis', swaggerJsonPath);
  } else {
    console.log('⚠️ src/docs/swagger.json introuvable — utilisation du fallback intégré.');
    swaggerDoc = fallbackSwagger;
  }
} catch (err) {
  console.warn('⚠️ Impossible de parser swagger.json — utilisation du fallback. Erreur:', err.message);
  swaggerDoc = fallbackSwagger;
}

app.get('/docs/swagger.json', (req, res) => {
  res.json(swaggerDoc);
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(null, { swaggerUrl: '/docs/swagger.json' }));

app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));

app.listen(PORT, () => {
  console.log(`🚀 Test Swagger server running: http://localhost:${PORT}/api/docs`);
  console.log(`   Spec JSON: http://localhost:${PORT}/docs/swagger.json`);
  console.log(`   Test endpoint: http://localhost:${PORT}/api/ping`);
});
