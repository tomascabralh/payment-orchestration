import { CountryVO } from "../../domain/CountryVO";
import { PaymentMethodVO } from "../../domain/PaymentMethodVO";
import { PaymentMethodsCountryAdapter } from "../../application/ListCountryPaymentMethodsUseCase";
import { PrismaPaymentMethodRepository } from "../../infrastructure/repositories/PrismaPaymentMethodRepository";

export class PaymentMethodsCountryAdapterImpl
  implements PaymentMethodsCountryAdapter
{
  constructor(
    private readonly paymentMethodRepository: PrismaPaymentMethodRepository
  ) {}

  async listByCountry(country: CountryVO): Promise<PaymentMethodVO[]> {
    return this.paymentMethodRepository.listByCountry(country);
  }
}
