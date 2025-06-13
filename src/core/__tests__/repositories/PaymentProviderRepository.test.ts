import type { PaymentProvider } from "../../entities/PaymentProviderEntity";
import type { PaymentProviderRepository } from "../../repositories/PaymentProviderRepository";

describe("PaymentProviderRepository", () => {
  it("getByCountry returns providers for a country", async () => {
    const mockProviders: PaymentProvider[] = [
      { name: "TestPay", code: "testpay", supportedCountries: ["AR"] },
    ];
    const repo: PaymentProviderRepository = {
      getByCountry: async (countryCode: string) =>
        countryCode === "AR" ? mockProviders : [],
    };
    const result = await repo.getByCountry("AR");
    expect(result).toEqual(mockProviders);
    const empty = await repo.getByCountry("US");
    expect(empty).toEqual([]);
  });
});
