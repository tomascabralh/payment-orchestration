import { PaymentOrder } from "../domain/PaymentOrder";
import { PaymentOrderRepository } from "../domain/PaymentOrderRepository";

export interface CreatePaymentOrderCommand {
  amount: number;
  description: string;
  countryIsoCode: string;
}

export class CreatePaymentOrderUseCase {
  constructor(private readonly repo: PaymentOrderRepository) {}

  async execute(cmd: CreatePaymentOrderCommand): Promise<PaymentOrder> {
    const uuid = crypto.randomUUID();
    const createdAt = new Date();
    const paymentUrl = `/payment_order/${uuid}`;
    const order = new PaymentOrder(
      uuid,
      cmd.amount,
      cmd.description,
      cmd.countryIsoCode,
      createdAt,
      paymentUrl,
      []
    );
    return this.repo.create(order);
  }
}
