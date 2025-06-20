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
    public readonly createdAt: Date,
    public readonly redirectUrl?: string
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
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    const countryCodeRegex = /^[A-Z]{2}$/;
    if (!countryCodeRegex.test(countryIsoCode)) {
      throw new Error(
        "Country code must be a valid ISO 3166-1 alpha-2 code (e.g., US, AR)"
      );
    }

    this.status = status || PaymentStatus.PENDING;
    this.transactions = transactions || [];
  }

  process(
    provider: string,
    transactionId: string,
    outcome: "success" | "failure",
    redirectUrl?: string
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
        new Date(),
        redirectUrl
      )
    );
  }
}
