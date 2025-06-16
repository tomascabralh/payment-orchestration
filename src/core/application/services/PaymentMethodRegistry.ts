import { PaymentMethodVO } from "../../domain/PaymentMethodVO";
import { PrismaPaymentMethodRepository } from "../../infrastructure/repositories/PrismaPaymentMethodRepository";
import { CountryVO } from "../../domain/CountryVO";

export class PaymentMethodRegistry {
  private providers: Map<string, PaymentMethodVO> = new Map();
  private repository: PrismaPaymentMethodRepository;

  constructor(
    repository: PrismaPaymentMethodRepository = new PrismaPaymentMethodRepository()
  ) {
    this.repository = repository;
    this.loadProviders();
  }

  private async loadProviders() {
    // Load providers for all supported countries
    const countries = ["US", "AR"];
    for (const countryCode of countries) {
      const country = new CountryVO(countryCode);
      const methods = await this.repository.listByCountry(country);
      methods.forEach((method) => this.registerProvider(method));
    }
  }

  registerProvider(provider: PaymentMethodVO): void {
    this.providers.set(provider.code, provider);
  }

  getProvider(code: string): PaymentMethodVO | undefined {
    return this.providers.get(code);
  }

  getAvailableProviders(countryCode: string): PaymentMethodVO[] {
    return Array.from(this.providers.values()).filter((provider) =>
      provider.supportedCountries.includes(countryCode)
    );
  }

  getAllProviders(): PaymentMethodVO[] {
    return Array.from(this.providers.values());
  }
}
