import { PaymentMethodRegistry } from "../../../application/services/PaymentMethodRegistry";
import { PaymentMethodVO } from "../../../domain/PaymentMethodVO";
import { PrismaPaymentMethodRepository } from "../../../infrastructure/repositories/PrismaPaymentMethodRepository";
import { CountryVO } from "../../../domain/CountryVO";

describe("PaymentMethodRegistry", () => {
  let registry: PaymentMethodRegistry;
  let repository: jest.Mocked<PrismaPaymentMethodRepository>;

  beforeEach(() => {
    repository = {
      listByCountry: jest.fn().mockResolvedValue([]),
      seedPaymentMethods: jest.fn(),
    } as any;

    registry = new PaymentMethodRegistry(repository);

    jest
      .spyOn(registry as any, "loadProviders")
      .mockImplementation(async () => {
        const methods = [
          new PaymentMethodVO("mp", "MercadoPago", ["AR"]),
          new PaymentMethodVO("wp", "WebPay", ["AR", "CL"]),
        ];
        methods.forEach((method) => registry.registerProvider(method));
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should register and retrieve a provider", () => {
    const provider = new PaymentMethodVO("mp", "MercadoPago", ["AR"]);
    registry.registerProvider(provider);

    const retrieved = registry.getProvider("mp");
    expect(retrieved).toBeDefined();
    expect(retrieved?.code).toBe("mp");
    expect(retrieved?.name).toBe("MercadoPago");
    expect(retrieved?.supportedCountries).toEqual(["AR"]);
  });

  it("should return undefined for non-existent provider", () => {
    const provider = registry.getProvider("non-existent");
    expect(provider).toBeUndefined();
  });

  it("should get available providers for a country", () => {
    const mp = new PaymentMethodVO("mp", "MercadoPago", ["AR"]);
    const wp = new PaymentMethodVO("wp", "WebPay", ["AR", "CL"]);
    const stripe = new PaymentMethodVO("stripe", "Stripe", ["US"]);

    registry.registerProvider(mp);
    registry.registerProvider(wp);
    registry.registerProvider(stripe);

    const argentinaProviders = registry.getAvailableProviders("AR");
    expect(argentinaProviders).toHaveLength(2);
    expect(argentinaProviders.map((p) => p.code)).toEqual(["mp", "wp"]);

    const chileProviders = registry.getAvailableProviders("CL");
    expect(chileProviders).toHaveLength(1);
    expect(chileProviders[0].code).toBe("wp");

    const usProviders = registry.getAvailableProviders("US");
    expect(usProviders).toHaveLength(1);
    expect(usProviders[0].code).toBe("stripe");
  });

  it("should return empty array for country with no providers", () => {
    const providers = registry.getAvailableProviders("BR");
    expect(providers).toHaveLength(0);
  });

  it("should get all registered providers", () => {
    const mp = new PaymentMethodVO("mp", "MercadoPago", ["AR"]);
    const wp = new PaymentMethodVO("wp", "WebPay", ["AR", "CL"]);
    const stripe = new PaymentMethodVO("stripe", "Stripe", ["US"]);

    registry.registerProvider(mp);
    registry.registerProvider(wp);
    registry.registerProvider(stripe);

    const allProviders = registry.getAllProviders();
    expect(allProviders).toHaveLength(3);
    expect(allProviders.map((p) => p.code)).toEqual(["mp", "wp", "stripe"]);
  });
});
