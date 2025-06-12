import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Example React Component Test", () => {
  it("renders without crashing", () => {
    render(<div>Hello World</div>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("handles user interactions", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Click me</button>
        <span>Not clicked</span>
      </div>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("Not clicked")).toBeInTheDocument();
  });
});
