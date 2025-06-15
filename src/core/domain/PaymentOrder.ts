export class PaymentOrder {
  constructor(
    public readonly uuid: string,
    public amount: number,
    public description: string,
    public countryIsoCode: string,
    public createdAt: Date
  ) {}
}

export interface PaymentProvider {
  name: string;
  code: string;
  supportedCountries: string[];
}
