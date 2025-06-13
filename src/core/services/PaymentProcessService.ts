import { SuccessProvider } from "../../mocks/SuccessProvider";
import { FailProvider } from "../../mocks/FailProvider";

export async function processWithProvider(providerCode: string) {
  if (providerCode.startsWith("glitchpay")) {
    return await FailProvider();
  }
  return await SuccessProvider();
}
