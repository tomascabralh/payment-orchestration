import { PaymentOrderRepositoryImpl } from "../../../infrastructure/repositories/PaymentOrderRepositoryImpl";

describe("PaymentOrderRepositoryImpl", () => {
  it("should construct", () => {
    const repo = new PaymentOrderRepositoryImpl();
    expect(repo).toBeDefined();
  });
});
