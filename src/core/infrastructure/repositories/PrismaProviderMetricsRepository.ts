import { PrismaClient } from "@prisma/client";

export class PrismaProviderMetricsRepository {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  async trackMetric(
    providerCode: string,
    success: boolean,
    responseTime: number
  ): Promise<void> {
    await this.prisma.providerMetric.upsert({
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

  async getMetrics(providerCode: string) {
    const metric = await this.prisma.providerMetric.findUnique({
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
}
