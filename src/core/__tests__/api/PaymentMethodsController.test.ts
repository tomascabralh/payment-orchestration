import { PaymentMethodsController } from "../../api/controllers/PaymentMethodsController";
import { ListCountryPaymentMethodsUseCase } from "../../application/ListCountryPaymentMethodsUseCase";
import { PaymentMethodVO } from "../../domain/PaymentMethodVO";
import { CountryVO } from "../../domain/CountryVO";

describe("PaymentMethodsController", () => {
  let controller: PaymentMethodsController;
  let mockUseCase: jest.Mocked<ListCountryPaymentMethodsUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
    } as any;
    controller = new PaymentMethodsController(mockUseCase);
  });

  it("should list payment methods for a country", async () => {
    const mockMethods = [
      new PaymentMethodVO("mp", "Mercado Pago", ["AR", "BR"]),
      new PaymentMethodVO("stripe", "Stripe", ["AR", "BR", "US"]),
    ];
    mockUseCase.execute.mockResolvedValue(mockMethods);

    const mockRes = {
      json: jest.fn(),
    };

    await controller.list({ query: { country_code: "AR" } }, mockRes);

    expect(mockUseCase.execute).toHaveBeenCalledWith("AR");
    expect(mockRes.json).toHaveBeenCalledWith(mockMethods);
  });
});
