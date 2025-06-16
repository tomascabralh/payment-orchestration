import {
  ListCountryPaymentMethodsUseCase,
  PaymentMethodsCountryAdapter,
} from "../../application/ListCountryPaymentMethodsUseCase";
import { PaymentMethodVO } from "../../domain/PaymentMethodVO";
import { CountryVO } from "../../domain/CountryVO";

describe("ListCountryPaymentMethodsUseCase", () => {
  let useCase: ListCountryPaymentMethodsUseCase;
  let adapter: jest.Mocked<PaymentMethodsCountryAdapter>;

  beforeEach(() => {
    adapter = {
      listByCountry: jest.fn(),
    };
    useCase = new ListCountryPaymentMethodsUseCase(adapter);
  });

  it("should return payment methods for a country", async () => {
    const methods = [
      new PaymentMethodVO("mp", "MercadoPago", ["AR"]),
      new PaymentMethodVO("wp", "WebPay", ["AR"]),
    ];
    adapter.listByCountry.mockResolvedValue(methods);

    const result = await useCase.execute("AR");

    expect(result).toHaveLength(2);
    expect(result[0].code).toBe("mp");
    expect(result[0].name).toBe("MercadoPago");
    expect(result[1].code).toBe("wp");
    expect(result[1].name).toBe("WebPay");
    expect(adapter.listByCountry).toHaveBeenCalledWith(new CountryVO("AR"));
  });

  it("should return empty array when no methods are available", async () => {
    adapter.listByCountry.mockResolvedValue([]);

    const result = await useCase.execute("BR");

    expect(result).toHaveLength(0);
    expect(adapter.listByCountry).toHaveBeenCalledWith(new CountryVO("BR"));
  });
});
