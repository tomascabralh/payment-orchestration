import { PaymentProvider } from "../core/entities/PaymentProviderEntity";

export const providers: Record<string, PaymentProvider> = {
  mercadopago: {
    name: "MercadoPago",
    code: "mp",
    supportedCountries: ["AR"],
  },
  webpay: {
    name: "WebPay",
    code: "wp",
    supportedCountries: ["CL"],
  },
  khipu: {
    name: "Khipu",
    code: "kh",
    supportedCountries: ["CL"],
  },
  stripe: {
    name: "Stripe",
    code: "stripe",
    supportedCountries: ["US"],
  },
  glitchpay_ar: {
    name: "GlitchPay",
    code: "glitchpay_ar",
    supportedCountries: ["AR"],
  },
  glitchpay_cl: {
    name: "GlitchPay",
    code: "glitchpay_cl",
    supportedCountries: ["CL"],
  },
  glitchpay_us: {
    name: "GlitchPay",
    code: "glitchpay_us",
    supportedCountries: ["US"],
  },
};
