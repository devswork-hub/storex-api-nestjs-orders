import { ShippingStatus } from '../value-objects/shipping-status';

export type ShippingSnapshot = {
  shippingId?: string; // ID externo do frete na API de envio
  status: ShippingStatus;
  carrier: string; // Exemplo: "Correios"
  service: string; // Exemplo: "PAC"
  fee?: number; // Taxa de entrega (ex: R$ 0,00)
  deliveryDate?: string; // Exemplo: "Entregue no dia 7 de junho"
  recipient?: string; // Exemplo: "Entregue nas mãos de um morador"
};
