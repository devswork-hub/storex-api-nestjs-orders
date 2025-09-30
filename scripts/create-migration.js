#!/usr/bin/env node

const { execSync } = require('child_process');

// nome da migration (primeiro argumento)
const migrationName = process.argv[2];

if (!migrationName) {
  console.error(
    '❌ Informe o nome da migration. Ex: npm run create:migration AddCustomerSnapshot',
  );
  process.exit(1);
}

// diretório atual (pasta onde rodou o terminal)
const cwd = process.cwd();

// monta o comando
const cmd = `npx typeorm migration:create ${cwd}/${migrationName}`;

console.log(`🚀 Criando migration em: ${cwd}/${migrationName}`);
execSync(cmd, { stdio: 'inherit' });
