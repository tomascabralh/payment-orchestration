export class PaymentOrder {
  constructor(
    public uuid: string,
    public amount: number,
    public description: string,
    public countryIsoCode: string,
    public createdAt: Date,
    public paymentUrl: string
  ) {}
}
