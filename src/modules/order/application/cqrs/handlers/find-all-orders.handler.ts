import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrderService } from '../../../domain/usecases/find-all-order.service';
import { OrderMapper } from '../../order.mapper';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { CacheService } from '@/app/persistence/cache/cache.service';

export class FindAllOrdersQuery {}

@QueryHandler(FindAllOrdersQuery)
export class FindAllOrdersHandler
  implements IQueryHandler<FindAllOrdersQuery, OrderOuput[]>
{
  constructor(
    private readonly findAllOrdersService: FindAllOrderService,
    private readonly cacheService: CacheService,
  ) {}

  async execute(): Promise<OrderOuput[]> {
    const cacheKey = ORDER_CACHE_KEYS.FIND_ALL;

    // Log para indicar a verificação do cache.
    console.log(`🔎 Verificando cache para a chave: ${cacheKey}`);

    try {
      const cached = await this.cacheService.get<OrderOuput[]>(cacheKey);

      if (cached) {
        // Log para indicar que os dados foram encontrados no cache.
        console.log(`✅ Dados encontrados no cache para a chave: ${cacheKey}`);
        return cached;
      }
    } catch (e) {
      throw new Error(e);
    }

    // Log para indicar que os dados NÃO foram encontrados no cache e a busca na fonte original será realizada.
    console.log(
      `❌ Cache não encontrado para a chave: ${cacheKey}. Buscando dados na fonte original...`,
    );
    const result = await this.findAllOrdersService.execute();

    if (result.length > 0) {
      const mapped = result.map(OrderMapper.fromEntitytoGraphQLOrderOutput);

      // Log para indicar que os novos dados estão sendo armazenados no cache.
      console.log(
        `⏳ Armazenando ${mapped.length} resultados no cache para a chave: ${cacheKey} (TTL: 60s)`,
      );

      await this.cacheService.set(cacheKey, mapped, 60);

      // Log para indicar o sucesso do armazenamento e o retorno dos dados.
      console.log(`✔️  Dados armazenados e retornados com sucesso.`);
      return mapped;
    }

    // Log para o caso de não haver resultados.
    console.log(`🚫 Nenhuma ordem encontrada. Retornando um array vazio.`);
    return [];
  }
}
