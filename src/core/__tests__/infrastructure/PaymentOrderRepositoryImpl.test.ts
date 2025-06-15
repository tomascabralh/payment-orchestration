import { PaymentOrderRepositoryImpl } from "../../infrastructure/PaymentOrderRepositoryImpl";

describe("PaymentOrderRepositoryImpl", () => {
  it("should construct", () => {
    const repo = new PaymentOrderRepositoryImpl();
    expect(repo).toBeDefined();
  });
});
