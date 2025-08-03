// import { Money } from '@/shared/domain/value-objects/money.vo';
// import {
//   Currency,
//   CurrencyEnum,
// } from '@/shared/domain/value-objects/currency.vo';
// import { DiscountTypeEnum } from '../../domain/order.constants';
// import { OrderItemModelContract } from '../../domain/order-item';
// import { OrderItemSubdocument } from './documents/order-item.document';
// import { CreateOrderGraphQLInput } from '../graphql/inputs/order.inputs';

// export class OrderItemMongoMapper {
//   static fromGraphQLInput(
//     input: CreateOrderGraphQLInput,
//   ): OrderItemModelContract {
//     return {
//       id: input.id ?? crypto.randomUUID(), // ou algum outro gerador
//       productId: input.productId,
//       quantity: input.quantity,
//       price: new Money(
//         input.price.amount,
//         new Currency(input.price.currency as CurrencyEnum),
//       ),
//       discount: input.discount
//         ? {
//             couponCode: input.discount.couponCode,
//             value: input.discount.value,
//             type: input.discount.type as DiscountTypeEnum,
//             currency: new Currency(input.discount.currency as CurrencyEnum),
//           }
//         : undefined,
//       seller: input.seller,
//       title: input.title,
//       imageUrl: input.imageUrl,
//       description: input.description,
//       shippingId: input.shippingId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//   }

//   static toDocument(doc: OrderItemModelContract): OrderItemSubdocument {
//     return {
//       ...doc,
//       _id: doc.id,
//       price: {
//         amount: doc.price.amount,
//         currency: doc.price.currency.code,
//       },
//       ...(doc.discount && {
//         discount: {
//           couponCode: doc.discount.couponCode,
//           value: doc.discount.value,
//           type: doc.discount.type,
//           currency: doc.discount.currency.code,
//         },
//       }),
//     };
//   }
//   static toDomain(doc: OrderItemSubdocument): OrderItemModelContract {
//     return {
//       ...doc,
//       price: new Money(
//         doc.price.amount,
//         new Currency(doc.price.currency as CurrencyEnum),
//       ),
//       ...(doc.discount && {
//         discount: {
//           couponCode: doc.discount.couponCode,
//           value: doc.discount.value,
//           type: doc.discount.type as DiscountTypeEnum,
//           currency: new Currency(doc.discount.currency as CurrencyEnum),
//         },
//       }),
//     };
//   }
// }
