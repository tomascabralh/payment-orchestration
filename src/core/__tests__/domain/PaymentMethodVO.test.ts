import { PaymentMethodVO } from "../../domain/PaymentMethodVO";

describe("PaymentMethodVO", () => {
  it("should construct with all fields", () => {
    const vo = new PaymentMethodVO("code", "name", ["AR"]);
    expect(vo.code).toBe("code");
    expect(vo.name).toBe("name");
    expect(vo.supportedCountries).toContain("AR");
  });
});
