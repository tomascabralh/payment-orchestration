import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert } from "../../components/ui/Alert";

describe("Alert", () => {
  it("renders success alert", () => {
    render(<Alert type="success">Success!</Alert>);
    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Success!")).toHaveClass("bg-green-50");
  });

  it("renders error alert", () => {
    render(<Alert type="error">Error!</Alert>);
    expect(screen.getByText("Error!")).toBeInTheDocument();
    expect(screen.getByText("Error!")).toHaveClass("bg-red-50");
  });
});
