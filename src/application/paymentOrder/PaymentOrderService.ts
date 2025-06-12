import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderRepository } from "../../domain/paymentOrder/PaymentOrderRepository";

export class PaymentOrderService {
  constructor(private repository: PaymentOrderRepository) {}

  async getPaymentOrder(uuid: string): Promise<PaymentOrder | null> {
    return this.repository.findById(uuid);
  }

  async createPaymentOrder(order: PaymentOrder): Promise<PaymentOrder> {
    return this.repository.create(order);
  }
}
