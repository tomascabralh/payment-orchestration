import { PaymentMethodVO } from "../../domain/PaymentMethodVO";

describe("PaymentMethodVO", () => {
  it("should create a payment method with required fields", () => {
    const vo = new PaymentMethodVO("tp", "TestPay", ["AR", "BR"]);

    expect(vo.code).toBe("tp");
    expect(vo.name).toBe("TestPay");
    expect(vo.supportedCountries).toEqual(["AR", "BR"]);
  });

  it("should support multiple countries", () => {
    const vo = new PaymentMethodVO("tp", "TestPay", ["AR", "BR", "CL"]);

    expect(vo.supportedCountries).toHaveLength(3);
    expect(vo.supportedCountries).toContain("AR");
    expect(vo.supportedCountries).toContain("BR");
    expect(vo.supportedCountries).toContain("CL");
  });
});
