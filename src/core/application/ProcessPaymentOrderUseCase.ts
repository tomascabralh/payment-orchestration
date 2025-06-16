import { PaymentOrder, PaymentStatus } from "../domain/PaymentOrder";
import { PaymentOrderRepository } from "../domain/PaymentOrderRepository";
import { PaymentGatewayAdapter } from "../infrastructure/PaymentGatewayAdapter";
import { PaymentMethodRegistry } from "./services/PaymentMethodRegistry";
import { PrismaPaymentMethodRepository } from "../infrastructure/repositories/PrismaPaymentMethodRepository";
import { PrismaProviderMetricsRepository } from "../infrastructure/repositories/PrismaProviderMetricsRepository";

export class ProcessPaymentOrderUseCase {
  constructor(
    private readonly repository: PaymentOrderRepository,
    private readonly gateway: PaymentGatewayAdapter,
    private readonly paymentMethodRegistry: PaymentMethodRegistry,
    private readonly paymentMethodRepository: PrismaPaymentMethodRepository,
    private readonly metricsRepository: PrismaProviderMetricsRepository
  ) {}

  async execute(input: {
    uuid: string;
    providerId: string;
  }): Promise<PaymentOrder> {
    const order = await this.repository.findById(input.uuid);
    if (!order) throw new Error("Payment order not found");
    if (order.status !== PaymentStatus.PENDING)
      throw new Error(`Order cannot be processed in ${order.status} state`);

    // Get available providers for this order
    const availableProviders = this.paymentMethodRegistry.getAvailableProviders(
      order.countryIsoCode
    );

    if (availableProviders.length === 0) {
      throw new Error("No payment providers available for this order");
    }

    // Try each provider until one succeeds
    let lastError: Error | null = null;

    for (const provider of availableProviders) {
      const startTime = Date.now();
      try {
        const result = await this.gateway.processPayment(provider.code);
        const responseTime = Date.now() - startTime;

        if (result.success) {
          // Track successful attempt
          await this.metricsRepository.trackMetric(
            provider.code,
            true,
            responseTime
          );

          order.process(
            provider.code,
            result.transactionId,
            "success",
            result.redirectUrl
          );
          await this.repository.update(order);
          return order;
        } else {
          // Track failed attempt
          await this.metricsRepository.trackMetric(
            provider.code,
            false,
            responseTime
          );

          // Record failed attempt
          order.process(
            provider.code,
            result.transactionId,
            "failure",
            result.redirectUrl
          );
          lastError = new Error(
            `Payment failed with provider ${provider.code}`
          );
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;
        // Track failed attempt
        await this.metricsRepository.trackMetric(
          provider.code,
          false,
          responseTime
        );

        lastError = error as Error;
        // Record failed attempt
        order.process(provider.code, `failed-${Date.now()}`, "failure");
      }
    }

    // If we get here, all providers failed
    await this.repository.update(order);
    throw new Error("All payment providers failed");
  }
}
