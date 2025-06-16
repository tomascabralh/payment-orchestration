import { PaymentOrderRepositoryImpl } from "../../../infrastructure/repositories/PaymentOrderRepositoryImpl";
import { PrismaClient } from "@prisma/client";
import { PaymentStatus } from "../../../domain/PaymentOrder";

// Mock PrismaClient globally
jest.mock("@prisma/client", () => {
  const mPrisma = {
    paymentOrder: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe("PaymentOrderRepositoryImpl", () => {
  let repository: PaymentOrderRepositoryImpl;
  let prismaMock: any;

  beforeEach(() => {
    repository = new PaymentOrderRepositoryImpl();
    prismaMock = (PrismaClient as jest.Mock).mock.results[0].value;
  });

  it("should return PaymentOrder from findById", async () => {
    prismaMock.paymentOrder.findUnique.mockResolvedValue({
      uuid: "abc-123",
      amount: 100,
      description: "Test order",
      countryIsoCode: "US",
      createdAt: new Date("2023-01-01"),
      status: "PENDING",
      transactions: [
        {
          transactionId: "tx-1",
          provider: "visa",
          status: "PENDING",
          amount: 100,
          createdAt: new Date("2023-01-01"),
        },
      ],
    });

    const result = await repository.findById("abc-123");

    expect(result).not.toBeNull();
    expect(result?.uuid).toBe("abc-123");
    expect(result?.transactions).toHaveLength(1);
    expect(result?.status).toBe(PaymentStatus.PENDING);
  });

  it("should return created PaymentOrder", async () => {
    prismaMock.paymentOrder.create.mockResolvedValue({
      uuid: "abc-456",
      amount: 200,
      description: "New order",
      countryIsoCode: "AR",
      createdAt: new Date("2023-02-01"),
      status: "SUCCESS",
      transactions: [],
    });

    const inputOrder = {
      uuid: "abc-456",
      amount: 200,
      description: "New order",
      countryIsoCode: "AR",
      createdAt: new Date("2023-02-01"),
      status: "SUCCESS",
      transactions: [],
    };

    const result = await repository.create(inputOrder as any);

    expect(result.uuid).toBe("abc-456");
    expect(result.status).toBe("SUCCESS");
  });

  it("should return updated PaymentOrder", async () => {
    prismaMock.paymentOrder.update.mockResolvedValue({
      uuid: "abc-789",
      amount: 300,
      description: "Updated order",
      countryIsoCode: "BR",
      createdAt: new Date("2023-03-01"),
      status: "FAILED",
      transactions: [
        {
          transactionId: "tx-2",
          provider: "paypal",
          status: "FAILED",
          amount: 300,
          createdAt: new Date("2023-03-01"),
        },
      ],
    });

    const inputOrder = {
      uuid: "abc-789",
      amount: 300,
      description: "Updated order",
      countryIsoCode: "BR",
      createdAt: new Date("2023-03-01"),
      status: PaymentStatus.FAILED,
      transactions: [
        {
          transactionId: "tx-2",
          provider: "paypal",
          status: PaymentStatus.FAILED,
          amount: 300,
          createdAt: new Date("2023-03-01"),
        },
      ],
    };

    const result = await repository.update(inputOrder as any);

    expect(result.uuid).toBe("abc-789");
    expect(result.transactions[0].provider).toBe("paypal");
  });
});
