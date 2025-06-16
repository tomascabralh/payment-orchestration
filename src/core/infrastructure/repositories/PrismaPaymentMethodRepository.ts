import { PrismaClient } from "@prisma/client";
import { PaymentMethodVO } from "../../domain/PaymentMethodVO";
import { CountryVO } from "../../domain/CountryVO";

export class PrismaPaymentMethodRepository {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  async listByCountry(country: CountryVO): Promise<PaymentMethodVO[]> {
    const methods = await this.prisma.paymentMethod.findMany({
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
      await this.prisma.paymentMethod.upsert({
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
