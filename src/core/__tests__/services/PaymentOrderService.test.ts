import { PaymentOrderService } from "../../services/PaymentOrderService";

describe("PaymentOrderService", () => {
  const mockRepo = {
    findById: jest.fn(),
    create: jest.fn(),
  };
  const mockProviderService = {
    execute: jest.fn(),
  };
  const service = new PaymentOrderService(
    mockRepo as any,
    mockProviderService as any
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw if order not found", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getPaymentOrder("bad-uuid")).resolves.toBeNull();
  });

  it("should create payment order and call repo", async () => {
    const order = {
      uuid: "id",
      amount: 10,
      description: "desc",
      countryIsoCode: "AR",
      createdAt: new Date(),
      paymentUrl: "",
      providers: [],
    };
    mockProviderService.execute.mockResolvedValue([
      { name: "Test", code: "test", supportedCountries: ["AR"] },
    ]);
    mockRepo.create.mockResolvedValue(order);
    const result = await service.createPaymentOrder(order);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(result).toEqual(order);
  });

  it("should return fail for glitchpay provider", async () => {
    const result = await service.processPaymentOrder("glitchpay_ar");
    expect(result.status).toBe("fail");
  });

  it("should return success for non-glitchpay provider", async () => {
    const result = await service.processPaymentOrder("otherpay");
    expect(result.status).toBe("success");
  });
});
