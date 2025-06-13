import { SuccessProvider } from "../../mocks/SuccessProvider";
import { FailProvider } from "../../mocks/FailProvider";

export async function processWithProvider(providerCode: string) {
  // GlitchPay always fails
  if (providerCode.startsWith("glitchpay")) {
    return await FailProvider();
  }
  // Add more real provider integrations here as needed
  // For now, all others succeed
  return await SuccessProvider();
}
