import type { PaymentOrder } from "../../entities/PaymentOrderEntity";
import type { PaymentOrderRepository } from "../../repositories/PaymentOrderRepository";

describe("PaymentOrderRepository", () => {
  let mockRepo: PaymentOrderRepository;
  let store: Record<string, PaymentOrder>;

  beforeEach(() => {
    store = {};

    mockRepo = {
      findById: async (uuid: string) => store[uuid] || null,
      create: async (order: PaymentOrder) => {
        store[order.uuid] = order;
        return order;
      },
    };
  });

  it("should create and find an order", async () => {
    const order: PaymentOrder = {
      uuid: "123",
      amount: 100,
      description: "Test order",
      countryIsoCode: "AR",
      createdAt: new Date(),
      paymentUrl: "http://localhost:4321/order/123",
      providers: [],
    };

    await mockRepo.create(order);

    const result = await mockRepo.findById("123");
    expect(result).toEqual(order);
  });

  it("should return null if order not found", async () => {
    const result = await mockRepo.findById("non-existent");
    expect(result).toBeNull();
  });
});
