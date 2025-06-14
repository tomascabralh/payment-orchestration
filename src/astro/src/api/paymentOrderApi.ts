import type { PaymentOrderFormData } from "../types/paymentsOrder";
import type { PaymentOrder } from "../../../core/domain/PaymentOrder";

export async function createPaymentOrder(data: PaymentOrderFormData) {
  const response = await fetch(`/api/payment_order/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error creating payment");
  }
  return response.json();
}

export async function fetchPaymentOrder(uuid: string): Promise<PaymentOrder> {
  const response = await fetch(`/api/payment_order/${uuid}`);
  if (!response.ok) {
    throw new Error("Error fetching order");
  }
  const data = await response.json();
  return {
    uuid: data.uuid,
    amount: data.amount,
    description: data.description,
    countryIsoCode: data.countryIsoCode,
    createdAt: new Date(data.createdAt),
    status: data.status,
    transactions: data.transactions,
    process: (
      provider: string,
      transactionId: string,
      outcome: "success" | "failure"
    ) => {
      return processPaymentOrder(uuid, provider, transactionId, outcome);
    },
  };
}

export async function processPaymentOrder(
  uuid: string,
  providerCode: string,
  transactionId: string,
  outcome: "success" | "failure"
) {
  const response = await fetch(`/api/payment_order/${uuid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ providerCode, transactionId, outcome }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Error al procesar el pago");
  }
  return result;
}
