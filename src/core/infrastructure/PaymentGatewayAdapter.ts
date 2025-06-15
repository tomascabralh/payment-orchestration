export class PaymentGatewayAdapter {
  async processPayment(providerCode: string): Promise<{
    success: boolean;
    transactionId: string;
    error?: string;
  }> {
    console.log(
      "🚀 ~ PaymentGatewayAdapter ~ processPayment ~ providerCode:",
      providerCode
    );
    // Simulate failure for providers
    if (providerCode.toLowerCase().includes("always_fail")) {
      console.log(
        `MockAdapter: Processing failed payment for ${providerCode}...`
      );
      return {
        success: false,
        transactionId: crypto.randomUUID(),
        error: "Always fail caused a failure.",
      };
    }

    // Simulate success for providers
    console.log(
      `MockAdapter: Processing successful payment for ${providerCode}...`
    );
    return {
      success: true,
      transactionId: "12345678-1234-5678-1234-567812345678",
    };
  }
}
