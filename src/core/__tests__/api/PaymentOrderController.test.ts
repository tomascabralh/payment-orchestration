import { PaymentOrderController } from "../../api/controllers/PaymentOrderController";
import { GetPaymentOrderUseCase } from "../../application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../application/CreatePaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../application/ProcessPaymentOrderUseCase";

describe("PaymentOrderController", () => {
  it("should construct with use cases", () => {
    const mockRepo = { findById: jest.fn(), create: jest.fn() };
    const mockProcessRepo = { process: jest.fn() };
    const mockProviderService = { getProvider: jest.fn() };
    const getUseCase = new GetPaymentOrderUseCase(mockRepo as any);
    const createUseCase = new CreatePaymentOrderUseCase(mockRepo as any);
    const processUseCase = new ProcessPaymentOrderUseCase(
      mockRepo as any,
      mockProcessRepo as any,
      mockProviderService as any
    );
    const controller = new PaymentOrderController(
      getUseCase,
      createUseCase,
      processUseCase
    );
    expect(controller).toBeDefined();
  });
});
