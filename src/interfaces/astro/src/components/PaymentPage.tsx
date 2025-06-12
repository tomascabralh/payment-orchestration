import React, { useState, useEffect } from 'react';

type PaymentPageProps = {
  order: {
    attributes: {
      amount: number;
      description: string;
      country_iso_code: string;
    };
  };
};

const PROVIDERS_API = '/api/payment_methods/';

export default function PaymentPage({ order }: PaymentPageProps) {
  const [providers, setProviders] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: '',
    documentType: 'dni',
    documentNumber: '',
    email: '',
    provider: '',
  });

  useEffect(() => {
    fetch(`${PROVIDERS_API}${order.attributes.country_iso_code}`)
      .then((res) => res.json())
      .then((data) => setProviders(data));
  }, [order.attributes.country_iso_code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would POST the form data to your backend
    alert('Pago enviado:\n' + JSON.stringify(form, null, 2));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">{order.attributes.description}</h1>
      <p className="mb-2">
        Monto: <span className="font-mono">${order.attributes.amount}</span>
      </p>
      <p className="mb-4">País: {order.attributes.country_iso_code}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Proveedor de pago</label>
          <select
            name="provider"
            value={form.provider}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccione un proveedor</option>
            {providers.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Nombre completo</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Nombre completo"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1">Tipo de documento</label>
            <select
              name="documentType"
              value={form.documentType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="dni">DNI</option>
              <option value="passport">Pasaporte</option>
              <option value="foreign_id">Cédula Extranjera</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1">Número</label>
            <input
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Número"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Pagar
        </button>
      </form>
    </div>
  );
}
