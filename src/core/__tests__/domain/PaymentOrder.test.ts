import { PaymentOrder } from "../../domain/PaymentOrder";

describe("PaymentOrder", () => {
  it("should construct with all fields", () => {
    const vo = new PaymentOrder("uuid", 100, "description", "AR", new Date());
    expect(vo.uuid).toBe("uuid");
    expect(vo.amount).toBe(100);
    expect(vo.description).toBe("description");
    expect(vo.countryIsoCode).toBe("AR");
    expect(vo.createdAt).toBeInstanceOf(Date);
  });
});
