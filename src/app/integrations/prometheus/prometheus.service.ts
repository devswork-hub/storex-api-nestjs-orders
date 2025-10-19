// import { Injectable } from '@nestjs/common';
// import * as client from 'prom-client';

// @Injectable()
// export class PrometheusService {
//   private readonly register: client.Registry;

//   constructor() {
//     this.register = new client.Registry();
//     this.register.setDefaultLabels({ app: 'nestjs-prometheus' });
//     client.collectDefaultMetrics({ register: this.register });
//   }

//   getMetrics(): Promise<string> {
//     return this.register.metrics();
//   }
// }

import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly register: client.Registry;

  private readonly graphqlRequestsTotal: client.Counter<string>;
  private readonly activeUsers: client.Gauge<string>;
  private readonly graphqlRequestDuration: client.Histogram<string>;

  constructor() {
    this.register = new client.Registry();

    this.register.setDefaultLabels({ app: 'nestjs-graphql-prometheus' });

    client.collectDefaultMetrics({ register: this.register });

    // Contador de operações GraphQL
    this.graphqlRequestsTotal = new client.Counter({
      name: 'graphql_operations_total',
      help: 'Total de operações GraphQL executadas',
      labelNames: ['operation', 'status'],
      registers: [this.register],
    });

    // Gauge de usuários ativos
    this.activeUsers = new client.Gauge({
      name: 'active_users',
      help: 'Número atual de usuários ativos',
      registers: [this.register],
    });

    // Histograma de duração das operações GraphQL
    this.graphqlRequestDuration = new client.Histogram({
      name: 'graphql_operation_duration_seconds',
      help: 'Duração das operações GraphQL em segundos',
      labelNames: ['operation', 'status'],
      buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.register],
    });
  }

  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  incrementOperation(operation: string, status: string) {
    this.graphqlRequestsTotal.inc({ operation, status });
  }

  setActiveUsers(value: number) {
    this.activeUsers.set(value);
  }

  observeDuration(
    operation: string,
    status: string,
    durationInSeconds: number,
  ) {
    this.graphqlRequestDuration.observe(
      { operation, status },
      durationInSeconds,
    );
  }
}
