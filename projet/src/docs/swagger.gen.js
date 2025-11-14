import path from 'node:path';
import fs from 'node:fs';
import YAML from 'yamljs';

const swaggerPath = path.resolve('src/docs/swagger.yaml');
if (!fs.existsSync(swaggerPath)) {
  console.error('swagger.yaml manquant');
  process.exit(1);
}
const doc = YAML.load(swaggerPath);
fs.writeFileSync(path.resolve('src/docs/swagger.json'), JSON.stringify(doc, null, 2));
console.log('Swagger JSON généré -> src/docs/swagger.json');
