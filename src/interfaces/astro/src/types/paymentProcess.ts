import type { PaymentOrder } from "../../../../domain/payment_order/PaymentOrderEntity";

export interface PaymentProcessFormData {
  fullName: string;
  documentType: "dni" | "passport" | "foreign_id";
  documentNumber: string;
  email: string;
  provider: string;
}

export interface PaymentProcessFormProps {
  onSubmit: (data: PaymentProcessFormData) => void;
  order: PaymentOrder;
  isLoading?: boolean;
}
