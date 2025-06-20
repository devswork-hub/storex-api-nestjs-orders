// import { Currency } from '../../shared/domain/value-objects/currency.vo';

import { Money } from '@/src/shared/domain/value-objects/money.vo';
import { Discount } from './order.constants';
import { calculateDiscountAmount } from './utils/discount-calculator';
import { BaseModel, BaseModelProps } from '@/src/shared/domain/base/model.base';

export type OrderItemContract = {
  productId: string; // "ID do produto no sistema externo"
  quantity: number; // "Quantidade do produto no pedido"
  price: Money; // "R$ 0,00"
  discount?: Discount;
  seller?: string; // "Nome do vendedor"
  title?: string; // "Nome do produto"
  imageUrl?: string; // "URL da imagem do produto"
  description?: string; // "Descrição do produto"
  shippingId?: string; // "ID do frete associado ao item"
} & BaseModelProps;

export class OrderItem extends BaseModel implements OrderItemContract {
  productId: string;
  quantity: number;
  price: Money;
  discount?: Discount;
  seller?: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  shippingId?: string;

  constructor(props: OrderItemContract) {
    super(props);
    Object.assign(this, props);
  }

  getTotalPrice(): Money {
    // return new Money(this.price.amount * this.quantity, this.price.currency);
    return this.price.multiply(this.quantity);
  }

  getDiscountAmount(): Money {
    const discountValue = calculateDiscountAmount(
      this.price.amount * this.quantity,
      this.discount, // supondo que o item tenha desconto no mesmo formato
      this.price.currency,
    );
    return new Money(discountValue, this.price.currency);
  }

  getTotalWithDiscount(): Money {
    const total = this.getTotalPrice();
    const discount = this.getDiscountAmount();
    return new Money(
      Math.max(0, total.amount - discount.amount),
      this.price.currency,
    );
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
