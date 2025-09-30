# --- Estágio 1: Build ---
FROM node:20 AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia todo o código-fonte
COPY . .

# Compila TypeScript para JavaScript
RUN npm run build

# --- Estágio 2: Produção ---
FROM node:20-alpine AS production

# Diretório de trabalho
WORKDIR /app

# Instala apenas dependências de produção
COPY package.json ./
RUN npm install --omit=dev

# Instala ferramentas necessárias (Postgres client e curl, se precisar)
RUN apk --no-cache add postgresql-client curl

# Copia código compilado do builder
COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta da aplicação
EXPOSE 5321

# Roda migrations e depois inicia a aplicação
CMD npx typeorm migration:run -d dist/src/app/persistence/typeorm/typeorm-datasource.js && node dist/src/main.js
