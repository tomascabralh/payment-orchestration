import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentProcessForm } from "../../components/paymentProcess/PaymentProcessForm";
import type { PaymentProvider } from "../../../../../core/entities/PaymentProviderEntity";

describe("PaymentProcessForm", () => {
  const providers: PaymentProvider[] = [
    { name: "TestPay", code: "tp", supportedCountries: ["AR"] },
    { name: "GlitchPay", code: "glitchpay_ar", supportedCountries: ["AR"] },
  ];
  const order = {
    uuid: "1",
    amount: 100,
    description: "Test order",
    countryIsoCode: "AR",
    createdAt: new Date(),
    paymentUrl: "",
    providers,
  };

  it("renders all fields and submits form data", () => {
    const handleSubmit = jest.fn();
    render(<PaymentProcessForm onSubmit={handleSubmit} order={order} />);

    fireEvent.change(screen.getByTestId("provider-select"), {
      target: { value: "tp" },
    });
    fireEvent.change(screen.getByTestId("fullName-input"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("documentType-select"), {
      target: { value: "passport" },
    });
    fireEvent.change(screen.getByTestId("documentNumber-input"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "john@example.com" },
    });

    fireEvent.submit(screen.getByTestId("payment-form"));

    expect(handleSubmit).toHaveBeenCalledWith({
      fullName: "John Doe",
      documentType: "passport",
      documentNumber: "123456",
      email: "john@example.com",
      provider: "tp",
    });
  });
});
