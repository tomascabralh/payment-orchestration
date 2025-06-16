import { CreatePaymentOrderUseCase } from "../../application/CreatePaymentOrderUseCase";
import { PaymentOrder, PaymentStatus } from "../../domain/PaymentOrder";
import { PaymentOrderRepository } from "../../domain/PaymentOrderRepository";

// Mock crypto.randomUUID
const mockUUID = "12345678-1234-5678-1234-567812345678";
global.crypto = {
  randomUUID: () => mockUUID,
} as any;

describe("CreatePaymentOrderUseCase", () => {
  let useCase: CreatePaymentOrderUseCase;
  let repository: jest.Mocked<PaymentOrderRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    useCase = new CreatePaymentOrderUseCase(repository);
  });

  it("should create a new payment order", async () => {
    const command = {
      amount: 100,
      description: "Test order",
      countryIsoCode: "AR",
    };

    const mockOrder = new PaymentOrder(
      mockUUID,
      command.amount,
      command.description,
      command.countryIsoCode,
      expect.any(Date)
    );

    repository.create.mockResolvedValue(mockOrder);

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(result.uuid).toBe(mockUUID);
    expect(result.amount).toBe(command.amount);
    expect(result.description).toBe(command.description);
    expect(result.countryIsoCode).toBe(command.countryIsoCode);
    expect(result.status).toBe(PaymentStatus.PENDING);
    expect(result.transactions).toHaveLength(0);
    expect(repository.create).toHaveBeenCalledWith(expect.any(PaymentOrder));
  });

  it("should create a payment order with different values", async () => {
    const command = {
      amount: 200,
      description: "Another test order",
      countryIsoCode: "BR",
    };

    const mockOrder = new PaymentOrder(
      mockUUID,
      command.amount,
      command.description,
      command.countryIsoCode,
      expect.any(Date)
    );

    repository.create.mockResolvedValue(mockOrder);

    const result = await useCase.execute(command);

    expect(result).toBeDefined();
    expect(result.uuid).toBe(mockUUID);
    expect(result.amount).toBe(command.amount);
    expect(result.description).toBe(command.description);
    expect(result.countryIsoCode).toBe(command.countryIsoCode);
    expect(result.status).toBe(PaymentStatus.PENDING);
    expect(result.transactions).toHaveLength(0);
    expect(repository.create).toHaveBeenCalledWith(expect.any(PaymentOrder));
  });
});
