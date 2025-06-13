import { providers } from "../../mocks/providers";

export function getProvidersByCountry(countryCode: string) {
  return Object.values(providers).filter((provider) =>
    provider.supportedCountries.includes(countryCode)
  );
}
