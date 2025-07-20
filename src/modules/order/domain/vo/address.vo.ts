export class Address {
  constructor(
    public readonly street: string,
    public readonly number: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
  ) {}

  static create(data: Address): Address {
    return new Address(
      data.street,
      data.number,
      data.city,
      data.state,
      data.zipCode,
    );
  }
}
