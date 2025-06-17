import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentOrderForm } from "../../components/paymentOrder/PaymentOrderForm";

describe("PaymentOrderForm", () => {
  it("renders all fields and submits form data", () => {
    const handleSubmit = jest.fn();
    render(<PaymentOrderForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByTestId("amount-input"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByTestId("description-input"), {
      target: { value: "Test description" },
    });
    fireEvent.change(screen.getByTestId("country-select"), {
      target: { value: "AR" },
    });

    fireEvent.submit(screen.getByTestId("order-form"));

    expect(handleSubmit).toHaveBeenCalledWith({
      amount: 123,
      description: "Test description",
      country_iso_code: "AR",
    });
  });
});
