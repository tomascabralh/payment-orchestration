import { CountryVO } from "../domain/CountryVO";
import { PaymentMethodVO } from "../domain/PaymentMethodVO";

export interface PaymentMethodsCountryAdapter {
  listByCountry(country: CountryVO): Promise<PaymentMethodVO[]>;
}

export class ListCountryPaymentMethodsUseCase {
  constructor(private readonly adapter: PaymentMethodsCountryAdapter) {}

  async execute(countryCode: string): Promise<PaymentMethodVO[]> {
    const country = new CountryVO(countryCode);
    return this.adapter.listByCountry(country);
  }
}
