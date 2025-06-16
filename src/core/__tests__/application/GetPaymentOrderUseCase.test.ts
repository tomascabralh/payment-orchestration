import { GetPaymentOrderUseCase } from "../../application/GetPaymentOrderUseCase";
import { PaymentOrder, PaymentStatus } from "../../domain/PaymentOrder";
import { PaymentOrderRepository } from "../../domain/PaymentOrderRepository";

describe("GetPaymentOrderUseCase", () => {
  let useCase: GetPaymentOrderUseCase;
  let repository: jest.Mocked<PaymentOrderRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    useCase = new GetPaymentOrderUseCase(repository);
  });

  it("should return a payment order when found", async () => {
    const order = new PaymentOrder("123", 100, "Test order", "AR", new Date());
    repository.findById.mockResolvedValue(order);

    const result = await useCase.execute("123");

    expect(result).toBeDefined();
    expect(result?.uuid).toBe("123");
    expect(result?.amount).toBe(100);
    expect(result?.description).toBe("Test order");
    expect(result?.countryIsoCode).toBe("AR");
    expect(result?.status).toBe(PaymentStatus.PENDING);
    expect(repository.findById).toHaveBeenCalledWith("123");
  });

  it("should return null when order is not found", async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute("non-existent");

    expect(result).toBeNull();
    expect(repository.findById).toHaveBeenCalledWith("non-existent");
  });
});
