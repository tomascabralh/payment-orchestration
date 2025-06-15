import { PrismaClient } from "@prisma/client";
import { PaymentOrder } from "../domain/PaymentOrder";
import { PaymentOrderRepository } from "../domain/PaymentOrderRepository";

const prisma = new PrismaClient();

export class PaymentOrderRepositoryImpl implements PaymentOrderRepository {
  async findById(uuid: string): Promise<PaymentOrder | null> {
    const record = await prisma.paymentOrder.findUnique({ where: { uuid } });
    if (!record) return null;
    return new PaymentOrder(
      record.uuid,
      record.amount,
      record.description,
      record.countryIsoCode,
      record.createdAt
    );
  }

  async create(order: PaymentOrder): Promise<PaymentOrder> {
    try {
      const record = await prisma.paymentOrder.create({
        data: {
          uuid: order.uuid,
          amount: order.amount,
          description: order.description,
          countryIsoCode: order.countryIsoCode,
          createdAt: order.createdAt,
        },
      });
      return new PaymentOrder(
        record.uuid,
        record.amount,
        record.description,
        record.countryIsoCode,
        record.createdAt
      );
    } catch (e) {
      console.error("Prisma create error:", e);
      throw e;
    }
  }
}
