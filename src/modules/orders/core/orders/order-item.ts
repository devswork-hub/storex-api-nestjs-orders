import { Currency } from './value-objects/currency';

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
};

export class OrderItem implements OrderItemContract {
  productId: string;
  quantity: number;
  price: number;
  currency: Currency;
  seller?: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  shippingId?: string;
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
