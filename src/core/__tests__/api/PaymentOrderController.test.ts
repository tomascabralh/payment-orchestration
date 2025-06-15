import { PaymentOrderController } from "../../api/controllers/PaymentOrderController";
import { GetPaymentOrderUseCase } from "../../application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../application/CreatePaymentOrderUseCase";

describe("PaymentOrderController", () => {
  it("should construct with use cases", () => {
    const mockRepo = { findById: jest.fn(), create: jest.fn() };
    const getUseCase = new GetPaymentOrderUseCase(mockRepo as any);
    const createUseCase = new CreatePaymentOrderUseCase(mockRepo as any);
    const controller = new PaymentOrderController(getUseCase, createUseCase);
    expect(controller).toBeDefined();
  });
});
