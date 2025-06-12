import { PrismaClient } from "@prisma/client";
import { PaymentOrder } from "../domain/paymentOrder/PaymentOrder";
import { PaymentOrderRepository } from "../domain/paymentOrder/PaymentOrderRepository";

const prisma = new PrismaClient();

export class PrismaPaymentOrderRepository implements PaymentOrderRepository {
  async findById(uuid: string): Promise<PaymentOrder | null> {
    const order = await prisma.paymentOrder.findUnique({ where: { uuid } });
    if (!order) return null;
    return new PaymentOrder(
      order.uuid,
      order.amount,
      order.description,
      order.countryIsoCode,
      order.createdAt,
      order.paymentUrl
    );
  }

  async create(order: PaymentOrder): Promise<PaymentOrder> {
    const created = await prisma.paymentOrder.create({
      data: {
        uuid: order.uuid,
        amount: order.amount,
        description: order.description,
        countryIsoCode: order.countryIsoCode,
        paymentUrl: order.paymentUrl,
        createdAt: order.createdAt,
      },
    });
    return new PaymentOrder(
      created.uuid,
      created.amount,
      created.description,
      created.countryIsoCode,
      created.createdAt,
      created.paymentUrl
    );
  }
}
