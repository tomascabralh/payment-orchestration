import { PaymentOrderController } from "../../api/controllers/PaymentOrderController";
import { GetPaymentOrderUseCase } from "../../application/GetPaymentOrderUseCase";
import { CreatePaymentOrderUseCase } from "../../application/CreatePaymentOrderUseCase";
import { ProcessPaymentOrderUseCase } from "../../application/ProcessPaymentOrderUseCase";
describe("PaymentOrderController", () => {
  it("should construct with use cases", () => {
    const mockRepo = { findById: jest.fn(), create: jest.fn() };
    const mockGateway = { processPayment: jest.fn() };
    const mockRegistry = { getAvailableProviders: jest.fn() };
    const mockMethodRepo = { listByCountry: jest.fn() };
    const mockMetricsRepo = { trackMetric: jest.fn() };

    const getUseCase = new GetPaymentOrderUseCase(mockRepo as any);
    const createUseCase = new CreatePaymentOrderUseCase(mockRepo as any);
    const processUseCase = new ProcessPaymentOrderUseCase(
      mockRepo as any,
      mockGateway as any,
      mockRegistry as any,
      mockMethodRepo as any,
      mockMetricsRepo as any
    );
    const controller = new PaymentOrderController(
      getUseCase,
      createUseCase,
      processUseCase
    );
    expect(controller).toBeDefined();
  });
});
