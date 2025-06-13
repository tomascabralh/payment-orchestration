import { PaymentOrderForm } from "./PaymentOrderForm";
import type { PaymentOrderFormData } from "../../types/paymentsOrder";

export const PaymentOrderContainer: React.FC = () => {
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
        throw new Error("Error creating payment");
      }
      const res = await response.json();
      window.location.href = `/payment_order/${res.uuid}`;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Pago</h1>
      <PaymentOrderForm onSubmit={handlePaymentSubmit} />
    </div>
  );
};
