import { PrismaClient } from "@prisma/client";
import { PaymentMethodVO } from "../../domain/PaymentMethodVO";
import { CountryVO } from "../../domain/CountryVO";

const prisma = new PrismaClient();

export class PaymentMethodService {
  private providers: Map<string, PaymentMethodVO> = new Map();

  constructor(initialProviders: PaymentMethodVO[] = []) {
    initialProviders.forEach((provider) => this.registerProvider(provider));
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

  async trackProviderMetric(
    providerCode: string,
    success: boolean,
    responseTime: number
  ): Promise<void> {
    await prisma.providerMetric.upsert({
      where: { providerCode },
      create: {
        providerCode,
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
        totalResponseTime: responseTime,
        lastUsed: new Date(),
      },
      update: {
        successCount: { increment: success ? 1 : 0 },
        failureCount: { increment: success ? 0 : 1 },
        totalResponseTime: { increment: responseTime },
        lastUsed: new Date(),
      },
    });
  }

  async getProviderMetrics(providerCode: string) {
    const metric = await prisma.providerMetric.findUnique({
      where: { providerCode },
    });

    if (!metric) {
      return {
        successRate: 0,
        averageResponseTime: 0,
        totalRequests: 0,
      };
    }

    const totalRequests = metric.successCount + metric.failureCount;
    const successRate =
      totalRequests > 0 ? metric.successCount / totalRequests : 0;
    const averageResponseTime =
      totalRequests > 0 ? Number(metric.totalResponseTime) / totalRequests : 0;

    return {
      successRate,
      averageResponseTime,
      totalRequests,
    };
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
