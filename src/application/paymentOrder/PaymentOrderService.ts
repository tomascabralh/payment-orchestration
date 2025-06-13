import { PaymentOrder } from "../../domain/payment_order/PaymentOrderEntity";
import { PaymentOrderRepository } from "../../domain/payment_order/PaymentOrderRepository";
import { GetProvidersByCountryService } from "../paymentProvider/GetProvidersByCountryService";

export class PaymentOrderService {
  constructor(
    private repository: PaymentOrderRepository,
    private getProvidersService: GetProvidersByCountryService
  ) {}

  async getPaymentOrder(uuid: string): Promise<PaymentOrder | null> {
    const order = await this.repository.findById(uuid);
    if (!order) return null;

    const providers = await this.getProvidersService.execute(
      order.countryIsoCode
    );
    return {
      ...order,
      providers,
    };
  }

  async createPaymentOrder(order: PaymentOrder): Promise<PaymentOrder> {
    const providers = await this.getProvidersService.execute(
      order.countryIsoCode
    );
    const orderWithProviders = {
      ...order,
      providers,
    };
    return this.repository.create(orderWithProviders);
  }
}
