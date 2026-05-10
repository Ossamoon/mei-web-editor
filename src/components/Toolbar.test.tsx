import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toolbar } from "./Toolbar";

describe("Toolbar", () => {
  const defaultProps = {
    fileName: "test.mei",
    onFileOpen: vi.fn(),
    onDownload: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Open, Download, and Examples buttons", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText(/Examples/)).toBeInTheDocument();
  });

  it("displays the file name", () => {
    render(<Toolbar {...defaultProps} fileName="myfile.mei" />);
    expect(screen.getByText("myfile.mei")).toBeInTheDocument();
  });

  it("calls onDownload when Download is clicked", async () => {
    const user = userEvent.setup();
    render(<Toolbar {...defaultProps} />);
    await user.click(screen.getByText("Download"));
    expect(defaultProps.onDownload).toHaveBeenCalledOnce();
  });

  it("opens and closes examples dropdown", async () => {
    const user = userEvent.setup();
    render(<Toolbar {...defaultProps} />);

    // Dropdown should not be visible initially
    expect(screen.queryByText("Basic Notation")).not.toBeInTheDocument();

    // Click Examples to open
    await user.click(screen.getByText(/Examples/));
    expect(screen.getByText("Basic Notation")).toBeInTheDocument();
    expect(screen.getByText("Chords & Voices")).toBeInTheDocument();

    // Click Examples again to close
    await user.click(screen.getByText(/Examples/));
    expect(screen.queryByText("Basic Notation")).not.toBeInTheDocument();
  });

  it("calls onFileOpen when an example is selected", async () => {
    const user = userEvent.setup();
    render(<Toolbar {...defaultProps} />);

    await user.click(screen.getByText(/Examples/));
    await user.click(screen.getByText("Basic Notation"));

    expect(defaultProps.onFileOpen).toHaveBeenCalledOnce();
    const [content, fileName] = defaultProps.onFileOpen.mock.calls[0];
    expect(fileName).toBe("sample.mei");
    expect(content).toContain("<mei");
  });

  it("closes dropdown after selecting an example", async () => {
    const user = userEvent.setup();
    render(<Toolbar {...defaultProps} />);

    await user.click(screen.getByText(/Examples/));
    await user.click(screen.getByText("Basic Notation"));

    expect(screen.queryByText("Chords & Voices")).not.toBeInTheDocument();
  });

  it("calls onFileOpen with file content when a file is selected", async () => {
    const user = userEvent.setup();
    render(<Toolbar {...defaultProps} />);

    const fileContent = "<mei>test</mei>";
    const file = new File([fileContent], "uploaded.mei", { type: "application/xml" });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();

    await user.upload(input, file);

    await waitFor(() => {
      expect(defaultProps.onFileOpen).toHaveBeenCalledOnce();
    });

    const [content, name] = defaultProps.onFileOpen.mock.calls[0];
    expect(name).toBe("uploaded.mei");
    expect(content).toBe(fileContent);
  });
});
