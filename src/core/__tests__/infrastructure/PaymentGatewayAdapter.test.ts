import { PaymentGatewayAdapter } from "../../infrastructure/PaymentGatewayAdapter";

const mockUUID = "12345678-1234-5678-1234-567812345678";
global.crypto = {
  randomUUID: () => mockUUID,
} as any;
describe("PaymentGatewayAdapter", () => {
  let adapter: PaymentGatewayAdapter;

  beforeEach(() => {
    adapter = new PaymentGatewayAdapter();
  });

  it("should process a successful payment", async () => {
    const result = await adapter.processPayment("tp");

    expect(result.success).toBe(true);
    expect(result.transactionId).toBe("12345678-1234-5678-1234-567812345678");
    expect(result.error).toBeUndefined();
  });

  it("should process a failed payment for always_fail provider", async () => {
    const result = await adapter.processPayment("always_fail");

    expect(result.success).toBe(false);
    expect(result.transactionId).toBeDefined();
    expect(result.error).toBe("Fail Bank caused a failure.");
  });

  it("should process a failed payment for case-insensitive always_fail provider", async () => {
    const result = await adapter.processPayment("ALWAYS_FAIL");

    expect(result.success).toBe(false);
    expect(result.transactionId).toBeDefined();
    expect(result.error).toBe("Fail Bank caused a failure.");
  });
});
