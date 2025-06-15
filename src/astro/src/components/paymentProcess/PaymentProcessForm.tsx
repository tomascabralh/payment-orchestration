import type { PaymentProcessFormProps } from "../../types/paymentProcess";
import type { PaymentProvider } from "../../../../core/domain/PaymentOrder";
import { Button } from "../ui/Button";
import { usePaymentProcessForm } from "../hooks/usePaymentProcessForm";
import React, { useEffect, useState } from "react";

export const PaymentProcessForm: React.FC<PaymentProcessFormProps> = ({
  onSubmit,
  order,
  isLoading = false,
}) => {
  const { form, handleChange, setForm, resetForm } = usePaymentProcessForm();
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    setLoadingProviders(true);
    fetch(`/api/payment_methods?country_code=${order.countryIsoCode}`)
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        setLoadingProviders(false);
      })
      .catch(() => {
        setProviders([]);
        setLoadingProviders(false);
      });
  }, [order.countryIsoCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Pago de Orden</h1>
        <p className="text-gray-600 mb-1">
          Monto:{" "}
          <span className="font-mono font-semibold">${order.amount}</span>
        </p>
        <p className="text-gray-600">Descripción: {order.description}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        data-testid="payment-form"
      >
        <div>
          <label className="block text-gray-700 mb-2">Proveedor de pago</label>
          {loadingProviders ? (
            <div>Cargando proveedores...</div>
          ) : (
            <select
              name="provider"
              value={form.provider}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="provider-select"
            >
              <option value="">Seleccione un proveedor</option>
              {providers.map((prov: PaymentProvider) => (
                <option
                  key={prov.code}
                  value={prov.code}
                  data-testid={`provider-option-${prov.code}`}
                >
                  {prov.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Nombre completo</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre completo"
            data-testid="fullName-input"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">
              Tipo de documento
            </label>
            <select
              name="documentType"
              value={form.documentType}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="documentType-select"
            >
              <option value="dni">DNI</option>
              <option value="passport">Pasaporte</option>
              <option value="foreign_id">Cédula Extranjera</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Número</label>
            <input
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número"
              data-testid="documentNumber-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
            data-testid="email-input"
          />
        </div>

        <Button type="submit" disabled={isLoading} data-testid="submit-btn">
          {isLoading ? "Procesando..." : "Pagar"}
        </Button>
      </form>
    </div>
  );
};
