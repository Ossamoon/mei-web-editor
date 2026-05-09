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

  describe("cursor context display", () => {
    it("shows nothing when cursorContext is null", () => {
      render(<StatusBar {...defaultProps} cursorContext={null} />);
      expect(screen.queryByTestId("cursor-context")).not.toBeInTheDocument();
    });

    it("shows element name", () => {
      render(
        <StatusBar
          {...defaultProps}
          cursorContext={{ element: "note", xmlId: null, attribute: null, text: null }}
        />,
      );
      expect(screen.getByText("<note>")).toBeInTheDocument();
    });

    it("shows element with attribute", () => {
      render(
        <StatusBar
          {...defaultProps}
          cursorContext={{ element: "note", xmlId: null, attribute: "dur", text: null }}
        />,
      );
      expect(screen.getByText(/dur/)).toBeInTheDocument();
    });

    it("shows element with text content", () => {
      render(
        <StatusBar
          {...defaultProps}
          cursorContext={{ element: "syl", xmlId: null, attribute: null, text: "Twin" }}
        />,
      );
      expect(screen.getByText(/"Twin"/)).toBeInTheDocument();
    });

    it("shows xmlId when present", () => {
      render(
        <StatusBar
          {...defaultProps}
          cursorContext={{ element: "note", xmlId: "n1", attribute: null, text: null }}
        />,
      );
      expect(screen.getByText(/n1/)).toBeInTheDocument();
    });
  });
});
