import { PaymentOrder } from "../entities/PaymentOrderEntity";
import { PaymentOrderRepository } from "../repositories/PaymentOrderRepository";
import { GetProvidersByCountryService } from "./PaymentProviderService";

import { SuccessProvider } from "../../mocks/SuccessProvider";
import { FailProvider } from "../../mocks/FailProvider";

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

  async processPaymentOrder(providerCode: string) {
    // GlitchPay always fails
    if (providerCode.startsWith("glitchpay")) {
      return await FailProvider();
    }

    return await SuccessProvider();
  }
}
