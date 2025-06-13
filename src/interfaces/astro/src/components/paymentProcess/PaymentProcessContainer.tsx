import React, { useState, useEffect } from "react";
import { PaymentProcessForm } from "./PaymentProcessForm";
import type { PaymentProcessFormData } from "../../types/paymentProcess";
import type { PaymentOrder } from "../../../../../domain/payment_order/PaymentOrderEntity";

interface PaymentProcessContainerProps {
  orderUuid: string;
}

export const PaymentProcessContainer: React.FC<
  PaymentProcessContainerProps
> = ({ orderUuid }) => {
  console.log("🚀 ~ orderUuid:", orderUuid);
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/payment_order/${orderUuid}`);

        if (!response.ok) {
          throw new Error("Error fetching order");
        }
        const data = await response.json();
        setOrder({
          uuid: data.uuid,
          amount: data.attributes.amount,
          description: data.attributes.description,
          countryIsoCode: data.attributes.country_iso_code,
          createdAt: new Date(data.attributes.created_at),
          paymentUrl: data.attributes.payment_url,
          providers: data.attributes.providers,
        });
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

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Payment data:", formData);
    } catch (err) {
      setError("Error al procesar el pago");
      console.error("Error processing payment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
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
