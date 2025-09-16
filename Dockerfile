# Development

FROM node:alpine AS development

RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /usr/src/app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

COPY . .
USER node

# Build
FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force
RUN npm ci --omit=dev && npm cache clean --force
USER node

# Production
FROM node:alpine AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

CMD ["/bin/sh", "-c", "/bin/wait-for-it.sh rabbitmq:5672 -- node dist/src/main.js"]

