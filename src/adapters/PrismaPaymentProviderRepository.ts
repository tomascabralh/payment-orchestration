import { PrismaClient } from "@prisma/client";
import { PaymentProviderRepository } from "../domain/payment_provider/PaymentProviderRepository";
import { PaymentProvider } from "../domain/payment_provider/PaymentProviderEntity";

const prisma = new PrismaClient();

export class PrismaPaymentProviderRepository
  implements PaymentProviderRepository
{
  async getByCountry(countryCode: string): Promise<PaymentProvider[]> {
    const providers = await prisma.paymentProvider.findMany({
      where: {
        supportedCountries: {
          has: countryCode,
        },
      },
    });

    return providers.map((provider) => ({
      name: provider.name,
      code: provider.code,
      supportedCountries: provider.supportedCountries,
    }));
  }
}
