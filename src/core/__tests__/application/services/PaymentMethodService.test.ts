import { PaymentMethodService } from "../../../application/services/PaymentMethodService";
import { PaymentMethodVO } from "../../../domain/PaymentMethodVO";
import { CountryVO } from "../../../domain/CountryVO";

describe("PaymentMethodService", () => {
  let service: PaymentMethodService;

  beforeEach(() => {
    service = new PaymentMethodService();
  });

  it("should initialize with provided providers", () => {
    const initialProviders = [
      new PaymentMethodVO("mp", "MercadoPago", ["AR"]),
      new PaymentMethodVO("wp", "WebPay", ["AR", "CL"]),
    ];
    service = new PaymentMethodService(initialProviders);

    const allProviders = service.getAllProviders();
    expect(allProviders).toHaveLength(2);
    expect(allProviders.map((p) => p.code)).toEqual(["mp", "wp"]);
  });

  it("should register and retrieve a provider", () => {
    const provider = new PaymentMethodVO("mp", "MercadoPago", ["AR"]);
    service.registerProvider(provider);

    const retrieved = service.getProvider("mp");
    expect(retrieved).toBeDefined();
    expect(retrieved?.code).toBe("mp");
    expect(retrieved?.name).toBe("MercadoPago");
    expect(retrieved?.supportedCountries).toEqual(["AR"]);
  });

  it("should return undefined for non-existent provider", () => {
    const provider = service.getProvider("non-existent");
    expect(provider).toBeUndefined();
  });

  it("should get available providers for a country", () => {
    const mp = new PaymentMethodVO("mp", "MercadoPago", ["AR"]);
    const wp = new PaymentMethodVO("wp", "WebPay", ["AR", "CL"]);
    const stripe = new PaymentMethodVO("stripe", "Stripe", ["US"]);

    service.registerProvider(mp);
    service.registerProvider(wp);
    service.registerProvider(stripe);

    const argentinaProviders = service.getAvailableProviders("AR");
    expect(argentinaProviders).toHaveLength(2);
    expect(argentinaProviders.map((p) => p.code)).toEqual(["mp", "wp"]);

    const chileProviders = service.getAvailableProviders("CL");
    expect(chileProviders).toHaveLength(1);
    expect(chileProviders[0].code).toBe("wp");

    const usProviders = service.getAvailableProviders("US");
    expect(usProviders).toHaveLength(1);
    expect(usProviders[0].code).toBe("stripe");
  });

  it("should return empty array for country with no providers", () => {
    const providers = service.getAvailableProviders("BR");
    expect(providers).toHaveLength(0);
  });

  it("should get all registered providers", () => {
    const mp = new PaymentMethodVO("mp", "MercadoPago", ["AR"]);
    const wp = new PaymentMethodVO("wp", "WebPay", ["AR", "CL"]);
    const stripe = new PaymentMethodVO("stripe", "Stripe", ["US"]);

    service.registerProvider(mp);
    service.registerProvider(wp);
    service.registerProvider(stripe);

    const allProviders = service.getAllProviders();
    expect(allProviders).toHaveLength(3);
    expect(allProviders.map((p) => p.code)).toEqual(["mp", "wp", "stripe"]);
  });

  it("should list providers by country", async () => {
    const argentinaMethods = await service.listByCountry(new CountryVO("AR"));
    expect(argentinaMethods).toHaveLength(3);
    expect(argentinaMethods.map((p) => p.code)).toEqual([
      "akira_credits",
      "fail_bank",
      "ghibli_pay",
    ]);

    const usMethods = await service.listByCountry(new CountryVO("US"));
    expect(usMethods).toHaveLength(3);
    expect(usMethods.map((p) => p.code)).toEqual([
      "fail_bank",
      "ghibli_pay",
      "nerve_transfer",
    ]);

    const brMethods = await service.listByCountry(new CountryVO("BR"));
    expect(brMethods).toHaveLength(0);
  });
});
