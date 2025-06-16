import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaymentProcessForm } from "../../components/paymentProcess/PaymentProcessForm";
import { PaymentMethodVO } from "../../../../core/domain/PaymentMethodVO";
import {
  PaymentOrder,
  PaymentStatus,
} from "../../../../core/domain/PaymentOrder";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("PaymentProcessForm", () => {
  const providers: PaymentMethodVO[] = [
    { name: "TestPay", code: "tp", supportedCountries: ["AR"] },
    { name: "GlitchPay", code: "glitchpay_ar", supportedCountries: ["AR"] },
  ];
  const order = new PaymentOrder(
    "1",
    100,
    "Test order",
    "AR",
    new Date(),
    PaymentStatus.PENDING,
    []
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all fields and submits form data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => providers,
    });

    const handleSubmit = jest.fn();
    render(<PaymentProcessForm onSubmit={handleSubmit} order={order} />);

    // Wait for providers to load
    await waitFor(() =>
      expect(screen.getByTestId("provider-select")).toBeInTheDocument()
    );

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
      paymentMethod: "credit_card",
      transactionId: "",
      status: "success",
      redirectUrl: "",
    });
  });
});
