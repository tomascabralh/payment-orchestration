export class PaymentMethodVO {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly supportedCountries: string[]
  ) {}
}
