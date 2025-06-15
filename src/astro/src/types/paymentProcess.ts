import type { PaymentOrder } from "../../../core/domain/PaymentOrder";

export interface PaymentProcessFormData {
  fullName: string;
  documentType: "dni" | "passport" | "foreign_id";
  documentNumber: string;
  email: string;
  provider: string;
  transactionId: string;
  status: "success" | "failure";
}

export interface PaymentProcessFormProps {
  onSubmit: (data: PaymentProcessFormData) => void;
  order: PaymentOrder;
  isLoading?: boolean;
}
