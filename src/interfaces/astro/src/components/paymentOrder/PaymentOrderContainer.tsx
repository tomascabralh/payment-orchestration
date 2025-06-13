import { PaymentOrderForm } from "./PaymentOrderForm";
import type { PaymentOrderFormData } from "../../types/paymentsOrder";
import { Alert } from "../ui/Alert";
import React, { useState } from "react";

export const PaymentOrderContainer: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSubmit = async (data: PaymentOrderFormData) => {
    try {
      const response = await fetch(`/api/payment_order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setError("Error creating payment");
        return;
      }
      const res = await response.json();
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
