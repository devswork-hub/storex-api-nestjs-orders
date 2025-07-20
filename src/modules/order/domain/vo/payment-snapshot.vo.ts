type Installment = {
  number: number;
  value: number;
  interestRate?: number;
  totalValue?: number;
  dueDate?: string;
};

export class PaymentSnapshotVO {
  readonly method: string;
  readonly status: 'paid' | 'pending' | 'failed' | string;
  readonly amount: number;
  readonly transactionId?: string;
  readonly installments?: Installment[];

  private constructor(props: PaymentSnapshotVO) {
    this.method = props.method;
    this.status = props.status;
    this.amount = props.amount;
    this.transactionId = props.transactionId;
    this.installments = props.installments;
  }

  static create(props: PaymentSnapshotVO): PaymentSnapshotVO {
    if (props.amount < 0) {
      throw new Error('Amount must be a positive number');
    }

    if (!props.method) {
      throw new Error('Payment method is required');
    }

    return new PaymentSnapshotVO(props);
  }

  toPrimitives() {
    return {
      method: this.method,
      status: this.status,
      amount: this.amount,
      transactionId: this.transactionId,
      installments: this.installments,
    };
  }
}
