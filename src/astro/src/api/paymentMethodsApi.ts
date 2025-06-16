export interface PaymentMethod {
  code: string;
  name: string;
}

export const fetchPaymentMethods = async (
  countryCode: string
): Promise<PaymentMethod[]> => {
  const response = await fetch(
    `/api/payment_methods?country_code=${countryCode}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch payment methods");
  }
  return response.json();
};
