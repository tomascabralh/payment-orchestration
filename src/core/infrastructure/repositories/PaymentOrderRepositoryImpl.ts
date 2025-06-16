import { PrismaClient } from "@prisma/client";
import {
  PaymentOrder,
  PaymentStatus,
  PaymentTransaction,
} from "../../domain/PaymentOrder";
import { PaymentOrderRepository } from "../../domain/PaymentOrderRepository";

const prisma = new PrismaClient();

export class PaymentOrderRepositoryImpl implements PaymentOrderRepository {
  async findById(uuid: string): Promise<PaymentOrder | null> {
    const record = await prisma.paymentOrder.findUnique({
      where: { uuid },
      include: { transactions: true },
    });
    if (!record) return null;

    return new PaymentOrder(
      record.uuid,
      record.amount,
      record.description,
      record.countryIsoCode,
      record.createdAt,
      record.status as PaymentStatus,
      record.transactions.map(
        (t) =>
          new PaymentTransaction(
            t.transactionId,
            t.provider,
            t.status as PaymentStatus,
            t.amount,
            t.createdAt
          )
      )
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
          status: order.status,
        },
        include: { transactions: true },
      });
      return new PaymentOrder(
        record.uuid,
        record.amount,
        record.description,
        record.countryIsoCode,
        record.createdAt,
        record.status as PaymentStatus,
        record.transactions.map(
          (t) =>
            new PaymentTransaction(
              t.transactionId,
              t.provider,
              t.status as PaymentStatus,
              t.amount,
              t.createdAt
            )
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async update(order: PaymentOrder): Promise<PaymentOrder> {
    const record = await prisma.paymentOrder.update({
      where: { uuid: order.uuid },
      data: {
        status: order.status,
        transactions: {
          create: order.transactions.map((t) => ({
            transactionId: t.transactionId,
            provider: t.provider,
            status: t.status as PaymentStatus,
            amount: t.amount,
            createdAt: t.createdAt,
          })),
        },
      },
      include: {
        transactions: true,
      },
    });

    return new PaymentOrder(
      record.uuid,
      record.amount,
      record.description,
      record.countryIsoCode,
      record.createdAt,
      record.status as PaymentStatus,
      record.transactions.map(
        (t) =>
          new PaymentTransaction(
            t.transactionId,
            t.provider,
            t.status as PaymentStatus,
            t.amount,
            t.createdAt
          )
      )
    );
  }
}
