// import { Injectable } from '@nestjs/common';
// import Redis from 'ioredis';

// @Injectable()
// export class RedisCacheRepository {
//   constructor(@InjectRedis() private readonly redis: Redis) {}

//   async saveData<T>(data: T, key: string): Promise<void> {
//     // key -> chave onde o redis irá salvar os dados
//     // JSON.stringify(data) -> salvar os dados em JSON
//     // EX -> utilizado para indicar que o tempo será passado em segundos
//     // 180 -> 180 segundos = 3 minutos de cache
//     // Time Complexity -> O(1)
//     await this.redis.set(key, JSON.stringify(data), 'EX', 180);
//   }

//   async getData<T>(key: string): Promise<T> {
//     // retorna o dado salvo da chave
//     // Time Complexity -> O(1)
//     return JSON.parse(await this.redis.get(key)) as T;
//   }
// }
