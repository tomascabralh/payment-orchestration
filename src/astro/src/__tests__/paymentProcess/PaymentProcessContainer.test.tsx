import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaymentProcessContainer } from "../../components/paymentProcess/PaymentProcessContainer";
import * as paymentOrderApi from "../../api/paymentOrderApi";
import * as paymentMethodsApi from "../../api/paymentMethodsApi";

// Mock the API calls
jest.mock("../../api/paymentOrderApi", () => ({
  fetchPaymentOrder: jest.fn(),
  processPaymentOrder: jest.fn(),
}));

jest.mock("../../api/paymentMethodsApi", () => ({
  fetchPaymentMethods: jest.fn(),
}));

describe("PaymentProcessContainer", () => {
  const orderUuid = "order-1";
  const mockOrder = {
    uuid: orderUuid,
    amount: 100,
    description: "Test Order",
    countryIsoCode: "AR",
    createdAt: new Date().toISOString(),
    paymentUrl: "",
    providers: [{ name: "TestPay", code: "tp", supportedCountries: ["AR"] }],
    status: "PENDING",
    transactions: [],
  };

  const mockProviders = [
    { name: "TestPay", code: "tp", supportedCountries: ["AR"] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (paymentOrderApi.fetchPaymentOrder as jest.Mock).mockResolvedValue(
      mockOrder
    );
    (paymentMethodsApi.fetchPaymentMethods as jest.Mock).mockResolvedValue(
      mockProviders
    );
  });

  it("renders loading state initially", () => {
    render(<PaymentProcessContainer orderUuid={orderUuid} />);
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("renders order details after loading", async () => {
    render(<PaymentProcessContainer orderUuid={orderUuid} />);

    await waitFor(() => {
      expect(screen.getByTestId("payment-form")).toBeInTheDocument();
    });
  });

  it("handles successful payment submission", async () => {
    const mockSuccessResponse = {
      uuid: orderUuid,
      type: "payment_order",
      attributes: {
        status: "PAID",
        transactions: [{ transaction_id: "tx-123" }],
      },
    };
    (paymentOrderApi.processPaymentOrder as jest.Mock).mockResolvedValue(
      mockSuccessResponse
    );

    render(<PaymentProcessContainer orderUuid={orderUuid} />);

    // Wait for form and provider select to be ready
    await waitFor(() => {
      expect(screen.getByTestId("provider-select")).toBeInTheDocument();
    });

    // Fill and submit form
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

    // Check success message
    await waitFor(() => {
      const successMessage = screen.getByText(
        /¡Pago exitoso! ID de transacción: tx-123/
      );
      expect(successMessage).toBeInTheDocument();
    });
  });
});
