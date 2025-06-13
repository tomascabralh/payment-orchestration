import React, { useState, useEffect } from "react";
import { PaymentProcessForm } from "./PaymentProcessForm";
import type { PaymentProcessFormData } from "../../types/paymentProcess";
import type { PaymentOrder } from "../../../../../core/entities/PaymentOrderEntity";
import { Alert } from "../ui/Alert";
import {
  fetchPaymentOrder,
  processPaymentOrder,
} from "../../api/paymentOrderApi";

interface PaymentProcessContainerProps {
  orderUuid: string;
}

export const PaymentProcessContainer: React.FC<
  PaymentProcessContainerProps
> = ({ orderUuid }) => {
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await fetchPaymentOrder(orderUuid);
        setOrder(order);
      } catch (err) {
        setError("Error al cargar los datos del pago");
        console.error("Error:", err);
      }
    };

    fetchOrder();
  }, [orderUuid]);

  const handleSubmit = async (formData: PaymentProcessFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await processPaymentOrder(orderUuid, formData.provider);
      if (result.status === "success") {
        setSuccess(
          `¡Pago exitoso! ID de transacción: ${result.transaction_id}`
        );
      } else {
        setError(result.error || "El pago falló.");
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago");
      console.error("Error processing payment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Alert type="error">{error}</Alert>
        {order && (
          <PaymentProcessForm
            onSubmit={handleSubmit}
            order={order}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Alert type="success">{success}</Alert>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <PaymentProcessForm
        onSubmit={handleSubmit}
        order={order}
        isLoading={isLoading}
      />
    </div>
  );
};
