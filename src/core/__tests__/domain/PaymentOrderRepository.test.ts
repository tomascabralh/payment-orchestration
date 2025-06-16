import { PaymentOrder, PaymentStatus } from "../../domain/PaymentOrder";
import { PaymentOrderRepository } from "../../domain/PaymentOrderRepository";

describe("PaymentOrderRepository", () => {
  let repository: jest.Mocked<PaymentOrderRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  });

  it("should create and find a payment order", async () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());

    repository.create.mockResolvedValue(order);
    repository.findById.mockResolvedValue(order);

    await repository.create(order);
    const found = await repository.findById("123");

    expect(found).toBeDefined();
    expect(found?.uuid).toBe("123");
    expect(found?.amount).toBe(100);
    expect(found?.description).toBe("Test order");
    expect(found?.countryIsoCode).toBe("AR");
    expect(found?.status).toBe(PaymentStatus.PENDING);
  });

  it("should return null when order is not found", async () => {
    repository.findById.mockResolvedValue(null);
    const found = await repository.findById("non-existent");
    expect(found).toBeNull();
  });

  it("should update a payment order", async () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());

    repository.create.mockResolvedValue(order);
    repository.findById.mockResolvedValue(order);
    repository.update.mockResolvedValue(order);

    await repository.create(order);
    order.process("tp", "tx-1", "success");
    await repository.update(order);

    const updated = await repository.findById("123");
    expect(updated?.status).toBe(PaymentStatus.PAID);
    expect(updated?.transactions).toHaveLength(1);
    expect(updated?.transactions[0].transactionId).toBe("tx-1");
    expect(updated?.transactions[0].provider).toBe("tp");
    expect(updated?.transactions[0].status).toBe(PaymentStatus.PAID);
  });
});
