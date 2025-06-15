import { PaymentOrderRepository } from "../domain/PaymentOrderRepository";
import { PaymentOrder } from "../domain/PaymentOrder";

export class GetPaymentOrderUseCase {
  constructor(private readonly repo: PaymentOrderRepository) {}

  async execute(uuid: string): Promise<PaymentOrder | null> {
    return this.repo.findById(uuid);
  }
}
