import { ApiClient } from "./client";

export interface PaymentMethod {
  code: string;
  name: string;
}

const api = new ApiClient();

export const fetchPaymentMethods = async (
  countryCode: string
): Promise<PaymentMethod[]> => {
  return api.get<PaymentMethod[]>(
    `/api/payment_methods?country_code=${countryCode}`
  );
};
