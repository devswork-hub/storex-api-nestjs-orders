# # Development
# FROM node:24-alpine AS development
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# USER node

# # Build
# FROM node:24-alpine AS build
# WORKDIR /usr/src/app
# COPY package*.json ./
# COPY --from=development /usr/src/app/node_modules ./node_modules
# COPY . .
# RUN npm run build
# ENV NODE_ENV production
# RUN npm ci --only=production && npm cache clean --force
# USER node

# # Production
# FROM node:24-alpine AS production
# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/dist ./dist
# COPY package*.json ./

# CMD ["node", "dist/src/main.js"]

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json) first to leverage Docker cache
COPY package.json ./
# COPY yarn.lock ./ # Or package-lock.json if using npm

# Install dependencies
RUN npm i install --frozen-lockfile # Or npm ci if using npm

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build # Or npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Set environment variables (e.g., for production)
ENV NODE_ENV=production

# Expose the port your NestJS application listens on (default is 3000)
EXPOSE 3000

# Set the user to run the application as (for security)
USER node

# Temporario
# RUN apk add --no-cache curl
CMD ["sh", "-c", "curl mongodb:27017 || node dist/src/main.js"]
# # Command to run the application in production mode
# CMD ["node", "dist/src/main.js"]
