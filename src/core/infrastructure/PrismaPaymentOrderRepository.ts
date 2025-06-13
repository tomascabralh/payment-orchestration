import { PrismaClient } from "@prisma/client";
import type { PaymentOrder } from "../entities/PaymentOrderEntity";
import { PaymentOrderRepository } from "../repositories/PaymentOrderRepository";

const prisma = new PrismaClient();

export class PrismaPaymentOrderRepository implements PaymentOrderRepository {
  async findById(uuid: string): Promise<PaymentOrder | null> {
    const order = await prisma.paymentOrder.findUnique({ where: { uuid } });
    if (!order) return null;
    return {
      uuid: order.uuid,
      amount: order.amount,
      description: order.description,
      countryIsoCode: order.countryIsoCode,
      createdAt: order.createdAt,
      paymentUrl: order.paymentUrl,
      providers:
        order.providers &&
        typeof order.providers === "string" &&
        order.providers.length > 0
          ? JSON.parse(order.providers as string)
          : [],
    };
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
        providers: JSON.stringify(order.providers),
      },
    });
    return {
      uuid: created.uuid,
      amount: created.amount,
      description: created.description,
      countryIsoCode: created.countryIsoCode,
      createdAt: created.createdAt,
      paymentUrl: created.paymentUrl,
      providers:
        created.providers &&
        typeof created.providers === "string" &&
        created.providers.length > 0
          ? JSON.parse(created.providers as string)
          : [],
    };
  }
}
