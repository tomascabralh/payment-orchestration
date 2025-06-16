import { ProcessPaymentOrderUseCase } from "../../application/ProcessPaymentOrderUseCase";
import { PaymentOrder, PaymentStatus } from "../../domain/PaymentOrder";
import { PaymentOrderRepository } from "../../domain/PaymentOrderRepository";
import { PaymentGatewayAdapter } from "../../infrastructure/adapters/PaymentGatewayAdapter";
import { PaymentMethodRegistry } from "../../application/services/PaymentMethodRegistry";
import { PrismaPaymentMethodRepository } from "../../infrastructure/repositories/PrismaPaymentMethodRepository";
import { PrismaProviderMetricsRepository } from "../../infrastructure/repositories/PrismaProviderMetricsRepository";
import { PaymentMethodVO } from "../../domain/PaymentMethodVO";

describe("ProcessPaymentOrderUseCase", () => {
  let useCase: ProcessPaymentOrderUseCase;
  let repository: jest.Mocked<PaymentOrderRepository>;
  let gateway: jest.Mocked<PaymentGatewayAdapter>;
  let paymentMethodRegistry: PaymentMethodRegistry;
  let paymentMethodRepository: jest.Mocked<PrismaPaymentMethodRepository>;
  let metricsRepository: jest.Mocked<PrismaProviderMetricsRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    gateway = {
      processPayment: jest.fn(),
    };
    paymentMethodRepository = {
      listByCountry: jest
        .fn()
        .mockResolvedValue([
          new PaymentMethodVO("mp", "MercadoPago", ["AR"]),
          new PaymentMethodVO("wp", "WebPay", ["AR"]),
        ]),
      seedPaymentMethods: jest.fn(),
    } as any;
    metricsRepository = {
      trackMetric: jest.fn(),
    } as any;

    paymentMethodRegistry = new PaymentMethodRegistry(paymentMethodRepository);
    useCase = new ProcessPaymentOrderUseCase(
      repository,
      gateway,
      paymentMethodRegistry,
      paymentMethodRepository,
      metricsRepository
    );
  });

  it("should process a payment with specific provider", async () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());
    repository.findById.mockResolvedValue(order);
    repository.update.mockResolvedValue(order);
    gateway.processPayment.mockResolvedValue({
      success: true,
      transactionId: "tx-1",
      redirectUrl: "https://example.com/success",
    });

    const result = await useCase.execute({
      uuid: "123",
      providerId: "mp",
    });

    expect(result.status).toBe(PaymentStatus.PAID);
    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0].transactionId).toBe("tx-1");
    expect(result.transactions[0].provider).toBe("mp");
    expect(result.transactions[0].status).toBe(PaymentStatus.PAID);
    expect(repository.update).toHaveBeenCalledWith(result);
    expect(metricsRepository.trackMetric).toHaveBeenCalledWith(
      "mp",
      true,
      expect.any(Number)
    );
  });

  it("should try next provider when first one fails", async () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());
    repository.findById.mockResolvedValue(order);
    repository.update.mockResolvedValue(order);

    // First provider fails
    gateway.processPayment
      .mockResolvedValueOnce({
        success: false,
        transactionId: "tx-1",
        error: "First provider failed",
      })
      // Second provider succeeds
      .mockResolvedValueOnce({
        success: true,
        transactionId: "tx-2",
        redirectUrl: "https://example.com/success",
      });

    const result = await useCase.execute({
      uuid: "123",
      providerId: "mp",
    });

    expect(result.status).toBe(PaymentStatus.PAID);
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0].transactionId).toBe("tx-1");
    expect(result.transactions[0].provider).toBe("mp");
    expect(result.transactions[0].status).toBe(PaymentStatus.FAILED);
    expect(result.transactions[1].transactionId).toBe("tx-2");
    expect(result.transactions[1].provider).toBe("wp");
    expect(result.transactions[1].status).toBe(PaymentStatus.PAID);
    expect(repository.update).toHaveBeenCalledWith(result);
    expect(metricsRepository.trackMetric).toHaveBeenCalledWith(
      "mp",
      false,
      expect.any(Number)
    );
    expect(metricsRepository.trackMetric).toHaveBeenCalledWith(
      "wp",
      true,
      expect.any(Number)
    );
  });

  it("should throw error when all providers fail", async () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());
    repository.findById.mockResolvedValue(order);
    gateway.processPayment
      .mockResolvedValueOnce({
        success: false,
        transactionId: "tx-1",
        error: "First provider failed",
      })
      .mockResolvedValueOnce({
        success: false,
        transactionId: "tx-2",
        error: "Second provider failed",
      });

    await expect(
      useCase.execute({
        uuid: "123",
        providerId: "mp",
      })
    ).rejects.toThrow("All payment providers failed");
  });

  it("should throw error when no providers are available", async () => {
    const order = new PaymentOrder(
      "123",
      100,
      "Test order",
      "BR", // No providers support BR
      new Date()
    );
    repository.findById.mockResolvedValue(order);

    await expect(
      useCase.execute({
        uuid: "123",
        providerId: "mp",
      })
    ).rejects.toThrow("No payment providers available for this order");
  });
});
