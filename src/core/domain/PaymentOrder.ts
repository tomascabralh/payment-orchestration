export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export class PaymentTransaction {
  constructor(
    public readonly transactionId: string,
    public readonly provider: string,
    public readonly status: PaymentStatus,
    public readonly amount: number,
    public readonly createdAt: Date
  ) {}
}

export class PaymentOrder {
  public status: PaymentStatus;
  public transactions: PaymentTransaction[];

  constructor(
    public readonly uuid: string,
    public amount: number,
    public description: string,
    public countryIsoCode: string,
    public createdAt: Date,
    status?: PaymentStatus,
    transactions?: PaymentTransaction[]
  ) {
    this.status = status || PaymentStatus.PENDING;
    this.transactions = transactions || [];
  }

  process(
    provider: string,
    transactionId: string,
    outcome: "success" | "failure"
  ) {
    const newStatus =
      outcome === "success" ? PaymentStatus.PAID : PaymentStatus.FAILED;
    this.status = newStatus;
    this.transactions.push(
      new PaymentTransaction(
        transactionId,
        provider,
        newStatus,
        this.amount,
        new Date()
      )
    );
  }
}
