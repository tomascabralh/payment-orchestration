export class PaymentMethodVO {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly supportedCountries: string[]
  ) {}
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  redirectUrl?: string;
  error?: string;
}
