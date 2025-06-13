import { PaymentProvider } from "../domain/payment_provider/PaymentProviderEntity";

export const providers: Record<string, PaymentProvider> = {
  autobots: {
    name: "Autobots",
    code: "autobots",
    supportedCountries: ["US", "AR", "CL"],
  },
  decepticons: {
    name: "Decepticons",
    code: "decepticons",
    supportedCountries: ["US", "AR", "CL"],
  },
};
