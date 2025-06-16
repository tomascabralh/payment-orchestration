import { PaymentResult } from "../domain/PaymentMethodVO";

export class PaymentGatewayAdapter {
  async processPayment(providerCode: string): Promise<PaymentResult> {
    // Simulate failure for providers
    if (providerCode.toLowerCase().includes("fail_bank")) {
      return {
        success: false,
        transactionId: crypto.randomUUID(),
        redirectUrl: "https://example.com/payment-failed",
        error: "Fail Bank caused a failure.",
      };
    }

    // Simulate success for providers
    return {
      success: true,
      transactionId: crypto.randomUUID(),
      redirectUrl: "https://example.com/payment-success",
    };
  }
}
