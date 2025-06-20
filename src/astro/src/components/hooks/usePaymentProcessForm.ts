import { useState } from "react";
import type { PaymentProcessFormData } from "../../types/paymentProcess";

export function usePaymentProcessForm(
  initial?: Partial<PaymentProcessFormData>
) {
  const [form, setForm] = useState<PaymentProcessFormData>({
    fullName: initial?.fullName || "",
    documentType: initial?.documentType || "dni",
    documentNumber: initial?.documentNumber || "",
    email: initial?.email || "",
    provider: initial?.provider || "",
    paymentMethod: initial?.paymentMethod || "credit_card",
    transactionId: initial?.transactionId || "",
    status: initial?.status || "success",
    redirectUrl: initial?.redirectUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      documentType: "dni",
      documentNumber: "",
      email: "",
      provider: "",
      paymentMethod: "credit_card",
      transactionId: "",
      status: "success",
      redirectUrl: "",
    });
  };

  return { form, setForm, handleChange, resetForm };
}
