import type { PaymentOrderFormProps } from "../../types/paymentsOrder";

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
    <form onSubmit={handleSubmit} className="space-y-4">
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
        >
          <option value="AR">Argentina</option>
          <option value="CL">Chile</option>
          <option value="US">Estados Unidos</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Crear Pago
      </button>
    </form>
  );
};
