import { PaymentOrder } from "../../domain/payment_order/PaymentOrderEntity";
import { PaymentOrderRepository } from "../../domain/payment_order/PaymentOrderRepository";
import { getProvidersByCountry } from "../../domain/payment_provider/getProvidersByCountry";

export class PaymentOrderService {
  constructor(private repository: PaymentOrderRepository) {}

  async getPaymentOrder(uuid: string): Promise<PaymentOrder | null> {
    return this.repository.findById(uuid);
  }

  async createPaymentOrder(order: PaymentOrder): Promise<PaymentOrder> {
    const providers = getProvidersByCountry(order.countryIsoCode);
    const orderWithProviders = {
      ...order,
      providers,
    };
    return this.repository.create(orderWithProviders);
  }
}
