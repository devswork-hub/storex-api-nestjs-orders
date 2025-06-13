import { Identifier } from '../../../../shared/domain/core/identifier';

export class OrderID extends Identifier<OrderID> {
  constructor(value: string) {
    super(value);
  }
}

// const id = OrderID.generate(OrderID);
// id.getValue();
