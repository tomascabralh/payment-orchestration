import { PaymentMethodVO } from "../../domain/PaymentMethodVO";
import { CountryVO } from "../../domain/CountryVO";
import { prisma } from "../database/prisma";

export class PrismaPaymentMethodRepository {
  async listByCountry(country: CountryVO): Promise<PaymentMethodVO[]> {
    const methods = await prisma.paymentMethod.findMany({
      where: {
        isActive: true,
        supportedCountries: {
          has: country.code,
        },
      },
      orderBy: {
        code: "asc",
      },
    });

    return methods.map(
      (method) =>
        new PaymentMethodVO(method.code, method.name, method.supportedCountries)
    );
  }

  async seedPaymentMethods(methods: PaymentMethodVO[]): Promise<void> {
    for (const method of methods) {
      await prisma.paymentMethod.upsert({
        where: { code: method.code },
        create: {
          code: method.code,
          name: method.name,
          supportedCountries: method.supportedCountries,
        },
        update: {
          name: method.name,
          supportedCountries: method.supportedCountries,
        },
      });
    }
  }
}
