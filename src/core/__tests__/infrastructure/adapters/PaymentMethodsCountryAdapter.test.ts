import { PaymentMethodsCountryAdapterImpl } from "../../../infrastructure/adapters/PaymentMethodsCountryAdapter";
import { PrismaPaymentMethodRepository } from "../../../infrastructure/repositories/PrismaPaymentMethodRepository";

describe("PaymentMethodsCountryAdapterImpl", () => {
  it("should construct", () => {
    const adapter = new PaymentMethodsCountryAdapterImpl(
      new PrismaPaymentMethodRepository()
    );
    expect(adapter).toBeDefined();
  });
});
