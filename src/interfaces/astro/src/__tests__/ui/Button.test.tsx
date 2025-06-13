import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../../components/ui/Button";

describe("Button", () => {
  it("renders and calls onClick", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const btn = screen.getByTestId("ui-button");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders children", () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });
});
