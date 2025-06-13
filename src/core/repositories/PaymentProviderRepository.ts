import { PaymentProvider } from "../entities/PaymentProviderEntity";

export interface PaymentProviderRepository {
  getByCountry(countryCode: string): Promise<PaymentProvider[]>;
}
