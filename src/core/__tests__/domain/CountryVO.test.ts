import { CountryVO } from "../../domain/CountryVO";

describe("CountryVO", () => {
  it("should construct with all fields", () => {
    const vo = new CountryVO("AR");
    expect(vo.code).toBe("AR");
  });
});
