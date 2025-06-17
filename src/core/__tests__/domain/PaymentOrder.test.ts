import { PaymentOrder, PaymentStatus } from "../../domain/PaymentOrder";

describe("PaymentOrder", () => {
  it("should construct with all fields", () => {
    const vo = new PaymentOrder("uuid", 100, "description", "AR", new Date());
    expect(vo.uuid).toBe("uuid");
    expect(vo.amount).toBe(100);
    expect(vo.description).toBe("description");
    expect(vo.countryIsoCode).toBe("AR");
    expect(vo.createdAt).toBeInstanceOf(Date);
  });

  it("should throw error when amount is zero", () => {
    expect(() => {
      new PaymentOrder("uuid", 0, "description", "AR", new Date());
    }).toThrow("Amount must be greater than zero");
  });

  it("should throw error when amount is negative", () => {
    expect(() => {
      new PaymentOrder("uuid", -100, "description", "AR", new Date());
    }).toThrow("Amount must be greater than zero");
  });

  it("should throw error when country code is invalid", () => {
    expect(() => {
      new PaymentOrder("uuid", 100, "description", "ARG", new Date());
    }).toThrow("Country code must be a valid ISO 3166-1 alpha-2 code");
  });

  it("should throw error when country code is lowercase", () => {
    expect(() => {
      new PaymentOrder("uuid", 100, "description", "ar", new Date());
    }).toThrow("Country code must be a valid ISO 3166-1 alpha-2 code");
  });

  it("should create a new payment order with default status", () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());

    expect(order.uuid).toBe("123");
    expect(order.amount).toBe(100);
    expect(order.description).toBe("Test order");
    expect(order.countryIsoCode).toBe("AR");
    expect(order.status).toBe(PaymentStatus.PENDING);
    expect(order.transactions).toHaveLength(0);
  });

  it("should process a successful payment", () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());

    order.process("tp", "tx-1", "success");

    expect(order.status).toBe(PaymentStatus.PAID);
    expect(order.transactions).toHaveLength(1);
    expect(order.transactions[0].transactionId).toBe("tx-1");
    expect(order.transactions[0].provider).toBe("tp");
    expect(order.transactions[0].status).toBe(PaymentStatus.PAID);
  });

  it("should process a failed payment", () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());

    order.process("tp", "tx-1", "failure");

    expect(order.status).toBe(PaymentStatus.FAILED);
    expect(order.transactions).toHaveLength(1);
    expect(order.transactions[0].transactionId).toBe("tx-1");
    expect(order.transactions[0].provider).toBe("tp");
    expect(order.transactions[0].status).toBe(PaymentStatus.FAILED);
  });
});
