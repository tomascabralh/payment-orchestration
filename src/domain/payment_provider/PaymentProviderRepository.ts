import { PaymentProvider } from "./PaymentProviderEntity";

export interface PaymentProviderRepository {
  getByCountry(countryCode: string): Promise<PaymentProvider[]>;
}
