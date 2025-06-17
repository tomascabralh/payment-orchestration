import type { PaymentOrderFormProps } from "../../types/paymentsOrder";
import React from "react";
import { Button } from "../ui/Button";

export const PaymentOrderForm: React.FC<PaymentOrderFormProps> = ({
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
      country_iso_code: formData.get("country") as string,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid="order-form"
    >
      <div>
        <label htmlFor="amount" className="block text-gray-700 mb-2">
          Monto
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese el monto"
          data-testid="amount-input"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700 mb-2">
          Descripción
        </label>
        <input
          type="text"
          id="description"
          name="description"
          required
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descripción del pago"
          data-testid="description-input"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-gray-700 mb-2">
          País
        </label>
        <select
          id="country"
          name="country"
          required
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="country-select"
        >
          <option value="AR">Argentina</option>
          <option value="US">Estados Unidos</option>
        </select>
      </div>

      <Button type="submit" data-testid="submit-btn">
        Crear Pago
      </Button>
    </form>
  );
};
