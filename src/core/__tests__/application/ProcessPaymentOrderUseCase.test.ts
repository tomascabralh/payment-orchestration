import { ProcessPaymentOrderUseCase } from "../../application/ProcessPaymentOrderUseCase";
import { PaymentOrder, PaymentStatus } from "../../domain/PaymentOrder";
import { PaymentOrderRepository } from "../../domain/PaymentOrderRepository";
import { PaymentGatewayAdapter } from "../../infrastructure/PaymentGatewayAdapter";
import { PaymentMethodService } from "../../application/services/PaymentMethodService";

describe("ProcessPaymentOrderUseCase", () => {
  let useCase: ProcessPaymentOrderUseCase;
  let repository: jest.Mocked<PaymentOrderRepository>;
  let gateway: jest.Mocked<PaymentGatewayAdapter>;
  let providerService: PaymentMethodService;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    gateway = {
      processPayment: jest.fn(),
    };
    providerService = new PaymentMethodService([
      {
        code: "mp",
        name: "MercadoPago",
        supportedCountries: ["AR"],
      },
      {
        code: "wp",
        name: "WebPay",
        supportedCountries: ["AR"],
      },
    ]);
    useCase = new ProcessPaymentOrderUseCase(
      repository,
      gateway,
      providerService
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
  });

  it("should try next provider when first one fails", async () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());
    repository.findById.mockResolvedValue(order);
    repository.update.mockResolvedValue(order);

    // First provider fails
    gateway.processPayment
      .mockRejectedValueOnce(new Error("First provider failed"))
      // Second provider succeeds
      .mockResolvedValueOnce({
        success: true,
        transactionId: "tx-2",
        redirectUrl: "https://example.com/success",
      });

    const result = await useCase.execute({
      uuid: "123",
      providerId: "wp",
    });

    expect(result.status).toBe(PaymentStatus.PAID);
    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0].transactionId).toBe("tx-2");
    expect(result.transactions[0].provider).toBe("wp");
    expect(result.transactions[0].status).toBe(PaymentStatus.PAID);
    expect(repository.update).toHaveBeenCalledWith(result);
  });

  it("should throw error when all providers fail", async () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());
    repository.findById.mockResolvedValue(order);
    gateway.processPayment
      .mockRejectedValueOnce(new Error("First provider failed"))
      .mockRejectedValueOnce(new Error("Second provider failed"));

    await expect(
      useCase.execute({
        uuid: "123",
        providerId: "wp",
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
        providerId: "wp",
      })
    ).rejects.toThrow("No payment providers available for this order");
  });
});
