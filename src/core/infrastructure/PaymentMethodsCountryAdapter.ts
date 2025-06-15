import { CountryVO } from "../domain/CountryVO";
import { PaymentMethodVO } from "../domain/PaymentMethodVO";
import { PaymentMethodsCountryAdapter } from "../application/ListCountryPaymentMethodsUseCase";

export class PaymentMethodsCountryAdapterImpl
  implements PaymentMethodsCountryAdapter
{
  async listByCountry(country: CountryVO): Promise<PaymentMethodVO[]> {
    // In real case fetch from external/internal service
    const allMethods = [
      new PaymentMethodVO("credit_card", "Credit Card", ["US", "AR"]),
      new PaymentMethodVO("paypal", "PayPal", ["US"]),
      new PaymentMethodVO("bank_transfer", "Bank Transfer", ["AR"]),
      new PaymentMethodVO("always_fail", "Always Fail", ["US", "AR"]),
    ];
    return allMethods.filter((method) =>
      method.supportedCountries.includes(country.code)
    );
  }
}
