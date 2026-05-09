import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBar } from "./StatusBar";

describe("StatusBar", () => {
  const defaultProps = {
    isValid: true,
    errorMessage: null,
    verovioReady: true,
    cursorLine: 1,
    cursorCol: 0,
  };

  it("shows loading message when Verovio is not ready", () => {
    render(<StatusBar {...defaultProps} verovioReady={false} />);
    expect(screen.getByText("Loading Verovio...")).toBeInTheDocument();
  });

  it("shows 'Valid XML' when valid", () => {
    render(<StatusBar {...defaultProps} />);
    expect(screen.getByText("Valid XML")).toBeInTheDocument();
  });

  it("shows error message when invalid", () => {
    render(
      <StatusBar
        {...defaultProps}
        isValid={false}
        errorMessage="Unclosed tag at line 5"
      />,
    );
    expect(screen.getByText("Unclosed tag at line 5")).toBeInTheDocument();
  });

  it("displays cursor position", () => {
    render(<StatusBar {...defaultProps} cursorLine={42} cursorCol={15} />);
    expect(screen.getByText("Ln 42, Col 15")).toBeInTheDocument();
  });

  it("prioritizes loading state over valid state", () => {
    render(<StatusBar {...defaultProps} verovioReady={false} isValid={true} />);
    expect(screen.getByText("Loading Verovio...")).toBeInTheDocument();
    expect(screen.queryByText("Valid XML")).not.toBeInTheDocument();
  });
});
