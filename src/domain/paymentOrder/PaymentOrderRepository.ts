import { PaymentOrder } from "./PaymentOrder";

export interface PaymentOrderRepository {
  findById(uuid: string): Promise<PaymentOrder | null>;
  create(order: PaymentOrder): Promise<PaymentOrder>;
}
