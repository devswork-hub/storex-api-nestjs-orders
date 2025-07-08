import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import dotenv from 'dotenv';
import { ConfigSchema } from '@/src/app/config/config.schema';

const ENV_PATH = path.resolve(process.cwd(), '.env');

function createEnvFileIfMissing(keys: string[]) {
  if (!fs.existsSync(ENV_PATH)) {
    console.warn('.env não encontrado, criando com chaves esperadas...');

    const content = keys.map((key) => `${key}=\n`).join('');
    fs.writeFileSync(ENV_PATH, content);

    console.info(
      '.env criado. Preencha os valores antes de iniciar o projeto.',
    );
    process.exit(1);
  }
}

function validateEnv() {
  const env = dotenv.config({ path: ENV_PATH });

  if (env.error) {
    console.error('Erro ao carregar .env:', env.error);
    process.exit(1);
  }

  const result = ConfigSchema.safeParse(env.parsed);

  if (!result.success) {
    console.error('❌ Erros de validação no .env:');
    result.error.errors.forEach((err) => {
      console.error(`  - ${err.message} (${err.path.join('.')})`);
    });
    process.exit(1);
  }

  console.log('✅ .env válido!');
}

(function main() {
  const keys = Object.keys(ConfigSchema.shape);
  createEnvFileIfMissing(keys);
  validateEnv();
})();
