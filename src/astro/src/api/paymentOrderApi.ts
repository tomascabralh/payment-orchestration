import type { PaymentOrderFormData } from "../types/paymentsOrder";
import type { PaymentOrder } from "../../../core/domain/PaymentOrder";
import { ApiClient } from "./client";

const api = new ApiClient();

interface PaymentOrderResponse {
  uuid: string;
  type: "payment_order";
  attributes: {
    amount: number;
    description: string;
    country_iso_code: string;
    status: "PAID" | "PENDING" | "FAILED";
    created_at: string;
    transactions: Array<{
      transaction_id: string;
      provider: string;
      status: string;
      amount: number;
      created_at: string;
    }>;
  };
  error?: string;
}

export async function createPaymentOrder(data: PaymentOrderFormData) {
  return api.post<PaymentOrder>("/api/payment_order/", data);
}

export async function fetchPaymentOrder(uuid: string): Promise<PaymentOrder> {
  const data = await api.get<PaymentOrder>(`/api/payment_order/${uuid}`);
  return {
    ...data,
    createdAt: new Date(data.createdAt),
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
  outcome: "success" | "failure",
  redirectUrl?: string
): Promise<PaymentOrderResponse> {
  return api.post(`/api/payment_order/${uuid}`, {
    providerCode,
    transactionId,
    outcome,
    redirectUrl,
  });
}
