import { BaseModel, BaseModelProps } from '@/src/shared/domain/base/model.base';
import { Currency } from '@/src/shared/domain/value-objects/currency.vo';

export type OrderItemContract = {
  productId: string; // "ID do produto no sistema externo"
  quantity: number; // "Quantidade do produto no pedido"
  price: number; // "R$ 0,00"
  currency: Currency;
  seller?: string; // "Nome do vendedor"
  title?: string; // "Nome do produto"
  imageUrl?: string; // "URL da imagem do produto"
  description?: string; // "Descrição do produto"
  shippingId?: string; // "ID do frete associado ao item"
} & BaseModelProps;

export class OrderItem extends BaseModel implements OrderItemContract {
  productId: string;
  quantity: number;
  price: number;
  currency: Currency;
  seller?: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  shippingId?: string;
  static create: any;

  constructor(props: OrderItemContract) {
    super(props);
    Object.assign(this, props);
  }

  // attributes?: Record<string, string>; // "Cor: Azul, Tamanho: M"
  // sku?: string; // "SKU do produto"
  // weight?: number; // "Peso do produto em gramas"
  // dimensions?: {
  //   length: number; // "Comprimento em cm"
  //   width: number; // "Largura em cm"
  //   height: number; // "Altura em cm"
  // };
  // discount?: {
  //   value: number; // "Valor do desconto em R$"
  //   type: 'percentage' | 'fixed'; // "Tipo de desconto: percentual ou fixo"
  //   couponCode?: string; // "Código do cupom de desconto"
  //   description?: string; // "Descrição do desconto aplicado"
  // };
}
