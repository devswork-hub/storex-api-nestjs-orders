export class OrderID {
  constructor(private readonly id: string) {}

  getId(): string {
    return this.id;
  }

  toString(): string {
    return this.id;
  }

  equals(other: OrderID): boolean {
    return this.id === other.id;
  }

  static fromString(id: string): OrderID {
    return new OrderID(id);
  }
  static generate(): OrderID {
    const id = Math.random().toString(36).substring(2, 15);
    return new OrderID(id);
  }
  static isValid(id: string): boolean {
    return typeof id === 'string' && id.length > 0 && /^[a-zA-Z0-9]+$/.test(id);
  }
  static isEqual(id1: OrderID, id2: OrderID): boolean {
    return id1.equals(id2);
  }
  static fromObject(obj: { id: string }): OrderID {
    if (!obj || !obj.id || typeof obj.id !== 'string') {
      throw new Error('Invalid object for OrderID');
    }
    return new OrderID(obj.id);
  }
  static toObject(orderId: OrderID): { id: string } {
    if (!(orderId instanceof OrderID)) {
      throw new Error('Invalid OrderID instance');
    }
    return { id: orderId.getId() };
  }
  static isOrderID(obj: any): obj is OrderID {
    return (
      obj instanceof OrderID ||
      (obj &&
        typeof obj.getId === 'function' &&
        typeof obj.equals === 'function')
    );
  }
  static isValidOrderID(obj: any): boolean {
    return OrderID.isOrderID(obj) && OrderID.isValid(obj.getId());
  }
  static fromJSON(json: string): OrderID {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed.id !== 'string') {
        throw new Error('Invalid JSON for OrderID');
      }
      return OrderID.fromObject(parsed);
    } catch (error) {
      throw new Error('Invalid JSON format for OrderID: ' + error.message);
    }
  }
  static toJSON(orderId: OrderID): string {
    if (!(orderId instanceof OrderID)) {
      throw new Error('Invalid OrderID instance for JSON conversion');
    }
    return JSON.stringify(OrderID.toObject(orderId));
  }
}
