import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaymentProcessContainer } from "../../components/paymentProcess/PaymentProcessContainer";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("PaymentProcessContainer", () => {
  const orderUuid = "order-1";
  const orderResponse = {
    uuid: orderUuid,
    attributes: {
      amount: 100,
      description: "desc",
      country_iso_code: "AR",
      created_at: new Date().toISOString(),
      payment_url: "",
      providers: [{ name: "TestPay", code: "tp", supportedCountries: ["AR"] }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders and processes payment successfully", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => orderResponse }) // fetch order
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "success", transaction_id: "tx-1" }),
      }); // process payment
    render(<PaymentProcessContainer orderUuid={orderUuid} />);
    await waitFor(() => expect(screen.getByText(/desc/)).toBeInTheDocument());
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
    await waitFor(() => {
      expect(screen.getByText(/pago exitoso/i)).toBeInTheDocument();
      expect(screen.getByText(/tx-1/)).toBeInTheDocument();
    });
  });

  it("shows error on payment failure", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => orderResponse }) // fetch order
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "fail" }),
      }); // process payment
    render(<PaymentProcessContainer orderUuid={orderUuid} />);
    await waitFor(() => expect(screen.getByText(/desc/)).toBeInTheDocument());
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
    await waitFor(() => {
      expect(screen.getByText(/fail/i)).toBeInTheDocument();
    });
  });
});
