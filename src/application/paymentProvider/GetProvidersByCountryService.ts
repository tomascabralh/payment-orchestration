import { PaymentProviderRepository } from "@/domain/payment_provider/PaymentProviderRepository";

export class GetProvidersByCountryService {
  constructor(private readonly repo: PaymentProviderRepository) {}

  async execute(countryCode: string) {
    return this.repo.getByCountry(countryCode);
  }
}
