import { PaymentMethodsCountryAdapterImpl } from "../../infrastructure/PaymentMethodsCountryAdapter";

describe("PaymentMethodsCountryAdapterImpl", () => {
  it("should construct", () => {
    const adapter = new PaymentMethodsCountryAdapterImpl();
    expect(adapter).toBeDefined();
  });
});
