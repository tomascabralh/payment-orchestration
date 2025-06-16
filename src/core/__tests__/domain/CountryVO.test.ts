import { CountryVO } from "../../domain/CountryVO";

describe("CountryVO", () => {
  it("should create a country with valid code", () => {
    const vo = new CountryVO("AR");
    expect(vo.code).toBe("AR");
  });

  it("should throw error for invalid country code", () => {
    expect(() => new CountryVO("ABC")).toThrow("Invalid country code");
    expect(() => new CountryVO("A")).toThrow("Invalid country code");
    expect(() => new CountryVO("123")).toThrow("Invalid country code");
  });
});
