// API/network logic for payment orders

import type { PaymentOrderFormData } from "../types/paymentsOrder";
import type { PaymentOrder } from "../../../../core/entities/PaymentOrderEntity";

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
    amount: data.attributes.amount,
    description: data.attributes.description,
    countryIsoCode: data.attributes.country_iso_code,
    createdAt: new Date(data.attributes.created_at),
    paymentUrl: data.attributes.payment_url,
    providers: data.attributes.providers,
  };
}

export async function processPaymentOrder(uuid: string, providerCode: string) {
  const response = await fetch(`/api/payment_order/${uuid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ providerCode }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Error al procesar el pago");
  }
  return result;
}
