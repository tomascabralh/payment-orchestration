import {
  PaymentProviderService,
  PaymentProvider,
} from "../../application/services/PaymentMethodService";

describe("PaymentProviderService", () => {
  let service: PaymentProviderService;
  const mockProviders: PaymentProvider[] = [
    {
      code: "mp",
      name: "MercadoPago",
      supportedCountries: ["AR"],
      supportedPaymentMethods: ["credit_card", "bank_transfer"],
      priority: 1,
    },
    {
      code: "wp",
      name: "WebPay",
      supportedCountries: ["CL"],
      supportedPaymentMethods: ["credit_card"],
      priority: 2,
    },
    {
      code: "stripe",
      name: "Stripe",
      supportedCountries: ["US"],
      supportedPaymentMethods: ["credit_card", "paypal"],
      priority: 3,
    },
  ];

  beforeEach(() => {
    service = new PaymentProviderService(mockProviders);
  });

  it("should register and retrieve providers", () => {
    const provider = service.getProvider("mp");
    expect(provider).toBeDefined();
    expect(provider?.name).toBe("MercadoPago");
  });

  it("should get available providers for a country and payment method", () => {
    const providers = service.getAvailableProviders("AR", "credit_card");
    expect(providers).toHaveLength(1);
    expect(providers[0].code).toBe("mp");
  });

  it("should return empty array when no providers are available", () => {
    const providers = service.getAvailableProviders("BR", "credit_card");
    expect(providers).toHaveLength(0);
  });

  it("should sort providers by priority", () => {
    const newProvider: PaymentProvider = {
      code: "new",
      name: "New Provider",
      supportedCountries: ["AR"],
      supportedPaymentMethods: ["credit_card"],
      priority: 0,
    };
    service.registerProvider(newProvider);

    const providers = service.getAvailableProviders("AR", "credit_card");
    expect(providers).toHaveLength(2);
    expect(providers[0].code).toBe("new");
    expect(providers[1].code).toBe("mp");
  });

  it("should get all providers", () => {
    const providers = service.getAllProviders();
    expect(providers).toHaveLength(3);
  });
});
