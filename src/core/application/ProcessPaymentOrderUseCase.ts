import { PaymentOrder } from "../domain/PaymentOrder";
import { PaymentOrderRepository } from "../domain/PaymentOrderRepository";
import { PaymentGatewayAdapter } from "../infrastructure/PaymentGatewayAdapter";

export interface ProcessPaymentOrderInput {
  uuid: string;
  providerId: string;
}

export class ProcessPaymentOrderUseCase {
  constructor(
    private readonly paymentOrderRepository: PaymentOrderRepository,
    private readonly paymentGatewayAdapter: PaymentGatewayAdapter
  ) {}

  async execute(input: ProcessPaymentOrderInput): Promise<PaymentOrder> {
    const order = await this.paymentOrderRepository.findById(input.uuid);
    if (!order) {
      throw new Error("Payment order not found");
    }

    if (order.status !== "PENDING") {
      throw new Error(`Order cannot be processed in ${order.status} state`);
    }

    const result = await this.paymentGatewayAdapter.processPayment(
      input.providerId
    );

    order.process(
      input.providerId,
      result.transactionId,
      result.success ? "success" : "failure"
    );

    return this.paymentOrderRepository.update(order);
  }
}
