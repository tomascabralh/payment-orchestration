import { PaymentOrder } from "../entities/PaymentOrderEntity";

export interface PaymentOrderRepository {
  findById(uuid: string): Promise<PaymentOrder | null>;
  create(order: PaymentOrder): Promise<PaymentOrder>;
}
