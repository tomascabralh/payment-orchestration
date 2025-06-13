export interface PaymentProvider {
  name: string;
  code: string;
  supportedCountries: string[];
}
