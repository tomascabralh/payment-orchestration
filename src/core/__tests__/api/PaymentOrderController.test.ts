import { PaymentOrderController } from "../../api/controllers/PaymentOrderController";
import { GetPaymentOrderUseCase } from "../../application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../application/CreatePaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../application/ProcessPaymentOrderUseCase";
import { PaymentOrder, PaymentStatus } from "../../domain/PaymentOrder";

describe("PaymentOrderController", () => {
  let controller: PaymentOrderController;
  let mockGetUseCase: jest.Mocked<GetPaymentOrderUseCase>;
  let mockCreateUseCase: jest.Mocked<CreatePaymentOrderUseCase>;
  let mockProcessUseCase: jest.Mocked<ProcessPaymentOrderUseCase>;
  let mockRes: any;

  beforeEach(() => {
    mockGetUseCase = {
      execute: jest.fn(),
    } as any;
    mockCreateUseCase = {
      execute: jest.fn(),
    } as any;
    mockProcessUseCase = {
      execute: jest.fn(),
    } as any;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    controller = new PaymentOrderController(
      mockGetUseCase,
      mockCreateUseCase,
      mockProcessUseCase
    );
  });

  it("should get payment order by id", async () => {
    const mockOrder = new PaymentOrder(
      "123",
      100,
      "Test order",
      "AR",
      new Date()
    );
    mockGetUseCase.execute.mockResolvedValue(mockOrder);

    await controller.get({ params: { uuid: "123" } }, mockRes);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith("123");
    expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
  });

  it("should create payment order", async () => {
    const mockOrder = new PaymentOrder(
      "123",
      100,
      "Test order",
      "AR",
      new Date()
    );
    mockCreateUseCase.execute.mockResolvedValue(mockOrder);

    const mockReq = {
      body: {
        amount: 100,
        description: "Test order",
        country_iso_code: "AR",
      },
    };

    await controller.create(mockReq, mockRes);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
      amount: 100,
      description: "Test order",
      countryIsoCode: "AR",
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      uuid: mockOrder.uuid,
      type: "payment_order",
      attributes: {
        amount: mockOrder.amount,
        description: mockOrder.description,
        country_iso_code: mockOrder.countryIsoCode,
        created_at: mockOrder.createdAt,
      },
    });
  });

  it("should process payment order", async () => {
    const mockOrder = new PaymentOrder(
      "123",
      100,
      "Test order",
      "AR",
      new Date()
    );
    mockProcessUseCase.execute.mockResolvedValue(mockOrder);

    const mockReq = {
      params: { uuid: "123" },
      body: {
        provider_id: "mp",
        redirect_url: "https://example.com/success",
      },
    };

    await controller.process(mockReq, mockRes);

    expect(mockProcessUseCase.execute).toHaveBeenCalledWith({
      uuid: "123",
      providerId: "mp",
    });
    expect(mockRes.json).toHaveBeenCalledWith({
      uuid: mockOrder.uuid,
      type: "payment_order",
      attributes: {
        amount: mockOrder.amount,
        description: mockOrder.description,
        country_iso_code: mockOrder.countryIsoCode,
        status: mockOrder.status,
        created_at: mockOrder.createdAt,
        transactions: mockOrder.transactions.map((t) => ({
          transaction_id: t.transactionId,
          provider: t.provider,
          status: t.status,
          amount: t.amount,
          created_at: t.createdAt,
          redirect_url: t.redirectUrl,
        })),
      },
    });
  });

  it("should handle errors when getting payment order", async () => {
    mockGetUseCase.execute.mockResolvedValue(null);

    await controller.get({ params: { uuid: "123" } }, mockRes);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith("123");
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  it("should handle errors when creating payment order", async () => {
    const error = new Error("Invalid order data");
    mockCreateUseCase.execute.mockRejectedValue(error);

    const mockReq = {
      body: {
        amount: 100,
        description: "Test order",
        country_iso_code: "AR",
      },
    };

    await controller.create(mockReq, mockRes);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
      amount: 100,
      description: "Test order",
      countryIsoCode: "AR",
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid order data" });
  });

  it("should handle errors when processing payment", async () => {
    const error = new Error("Payment processing failed");
    mockProcessUseCase.execute.mockRejectedValue(error);

    const mockReq = {
      params: { uuid: "123" },
      body: {
        provider_id: "mp",
        redirect_url: "https://example.com/success",
      },
    };

    await controller.process(mockReq, mockRes);

    expect(mockProcessUseCase.execute).toHaveBeenCalledWith({
      uuid: "123",
      providerId: "mp",
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Payment processing failed",
    });
  });
});
