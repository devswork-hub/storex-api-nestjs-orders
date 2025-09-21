import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
// import { DomainSeeders } from './modules/order/application/domain.seeders';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ConfigSchemaType } from './app/config/config.values';
import { CorsMiddleware } from './app/utils/cors';
import { isProd } from './process-env';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const env = app.select(AppModule).get(ConfigService<ConfigSchemaType>);

  const allowedOrigins = isProd
    ? ['https://storex.vercel.app']
    : ['http://localhost:3000/*'];

  app.enableCors({
    ...CorsMiddleware({
      allowed_origins: allowedOrigins,
      allowed_methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

      /**
       * Define se a API permite o envio de credenciais em requisições cross-origin.
       *
       * 🔑 Quando `true`:
       * - O navegador envia cookies, cabeçalhos de autenticação (`Authorization`) e cabeçalhos definidos pelo cliente em requisições CORS.
       * - Necessário quando a autenticação da aplicação é baseada em **cookies/sessão**.
       * - Requer que o `Access-Control-Allow-Origin` seja configurado com uma **origem explícita** (não pode usar `*`).
       * - No frontend, é obrigatório configurar `{ credentials: "include" }` (fetch/axios) ou `credentials: "include"` (Apollo Client).
       *
       * 🚫 Quando `false`:
       * - O navegador **não envia cookies** nem headers de autenticação automaticamente em requisições cross-origin.
       * - Adequado para cenários onde a autenticação é feita via **JWT no header `Authorization`**,
       *   já que o token pode ser adicionado manualmente pelo cliente.
       *
       * 👉 Resumo:
       * - Use `true` se autenticação via cookies.
       * - Use `false` se autenticação via header JWT.
       */
      credentials: isProd ?? true,
    }),
    // allowedHeaders: 'Content-Type, Authorization',
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
  });

  // Trust proxy para rodar atrás de load balancer / reverse proxy
  app.set('trust proxy', 'loopback');

  // Logger mais restritivo em produção
  app.useLogger(isProd ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug']);

  // TODO: corrigir servico de criacao de dados fakes
  // if (process.env.RUN_SEED === 'true') {
  //   const seeder = app.get(DomainSeeders);
  //   await seeder.run();
  //   await app.close();
  //   return;
  // }

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      // Especificacoes para GraphQL conforme documentacao
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  await app.listen(env.get('APP_PORT'));
}

bootstrap();
