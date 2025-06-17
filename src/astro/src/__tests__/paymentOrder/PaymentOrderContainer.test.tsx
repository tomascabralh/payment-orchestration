import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaymentOrderContainer } from "../../components/paymentOrder/PaymentOrderContainer";

const mockFetch = jest.fn();
global.fetch = mockFetch;
const originalLocation = window.location;
beforeAll(() => {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = { href: "" };
});
afterAll(() => {
  window.location = originalLocation;
});

describe("PaymentOrderContainer", () => {
  it("submits the form and navigates on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({
        "content-type": "application/json",
      }),
      json: async () => ({ uuid: "123" }),
    });
    render(<PaymentOrderContainer />);
    fireEvent.change(screen.getByTestId("amount-input"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByTestId("description-input"), {
      target: { value: "desc" },
    });
    fireEvent.change(screen.getByTestId("country-select"), {
      target: { value: "AR" },
    });
    fireEvent.submit(screen.getByTestId("order-form"));
    await waitFor(() => {
      expect(window.location.href).toContain("/payment_order/123");
    });
  });
});
