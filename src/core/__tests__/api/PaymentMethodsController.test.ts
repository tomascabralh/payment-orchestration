import { PaymentMethodsController } from "../../api/controllers/PaymentMethodsController";
import { ListCountryPaymentMethodsUseCase } from "../../application/ListCountryPaymentMethodsUseCase";

describe("PaymentMethodsController", () => {
  it("should construct with use case", () => {
    const mockAdapter = { listByCountry: jest.fn() };
    const useCase = new ListCountryPaymentMethodsUseCase(mockAdapter as any);
    const controller = new PaymentMethodsController(useCase);
    expect(controller).toBeDefined();
  });
});
