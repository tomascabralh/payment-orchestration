import { processWithProvider } from "../../services/PaymentProcessService";

describe("processWithProvider", () => {
  it("returns fail for glitchpay provider", async () => {
    const result = await processWithProvider("glitchpay_ar");
    expect(result.status).toBe("fail");
  });

  it("returns success for non-glitchpay provider", async () => {
    const result = await processWithProvider("otherpay");
    expect(result.status).toBe("success");
  });
});
