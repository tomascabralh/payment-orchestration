import { PaymentOrderForm } from "./PaymentOrderForm";
import type { PaymentOrderFormData } from "../../types/paymentsOrder";
import { Alert } from "../ui/Alert";
import React, { useState } from "react";
import { createPaymentOrder } from "../../api/paymentOrderApi";

export const PaymentOrderContainer: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSubmit = async (data: PaymentOrderFormData) => {
    try {
      const res = await createPaymentOrder(data);
      window.location.href = `/payment_order/${res.uuid}`;
    } catch (error) {
      setError("Error creando el pago");
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Pago</h1>
      {error && <Alert type="error">{error}</Alert>}
      <PaymentOrderForm onSubmit={handlePaymentSubmit} />
    </div>
  );
};
