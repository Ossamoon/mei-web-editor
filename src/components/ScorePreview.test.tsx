import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScorePreview } from "./ScorePreview";

const testSvg = `
<svg>
  <g id="note-n1" class="note"><rect width="10" height="10" /></g>
  <g id="note-n2" class="note"><rect width="10" height="10" /></g>
  <g id="m1" class="measure"><rect width="100" height="50" /></g>
  <g id="page1" class="page"><rect width="100" height="100" /></g>
  <g id="sys1" class="system"><rect width="200" height="200" /></g>
</svg>
`;

describe("ScorePreview", () => {
  const defaultProps = {
    svgContent: testSvg,
    hasError: false,
    highlightedId: null,
    onNoteClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders SVG content", () => {
    render(<ScorePreview {...defaultProps} />);
    const svgElement = document.querySelector("svg");
    expect(svgElement).toBeTruthy();
  });

  it("shows error overlay when hasError is true", () => {
    const { container } = render(
      <ScorePreview {...defaultProps} hasError={true} />,
    );
    const overlay = container.querySelector(".bg-red-500\\/15");
    expect(overlay).toBeTruthy();
  });

  it("does not show error overlay when hasError is false", () => {
    const { container } = render(
      <ScorePreview {...defaultProps} hasError={false} />,
    );
    const overlay = container.querySelector(".bg-red-500\\/15");
    expect(overlay).toBeNull();
  });

  it("calls onNoteClick with element id when a note is clicked", () => {
    render(<ScorePreview {...defaultProps} />);
    const noteEl = document.getElementById("note-n1");
    expect(noteEl).toBeTruthy();

    fireEvent.click(noteEl!);
    expect(defaultProps.onNoteClick).toHaveBeenCalledWith("note-n1");
  });

  it("does not call onNoteClick for non-interactive elements", () => {
    render(<ScorePreview {...defaultProps} />);
    // "system" class elements should not trigger click
    const sysEl = document.getElementById("sys1");
    expect(sysEl).toBeTruthy();

    fireEvent.click(sysEl!);
    expect(defaultProps.onNoteClick).not.toHaveBeenCalled();
  });

  it("calls onNoteClick for measure elements", () => {
    render(<ScorePreview {...defaultProps} />);
    const measureEl = document.getElementById("m1");
    expect(measureEl).toBeTruthy();

    fireEvent.click(measureEl!);
    expect(defaultProps.onNoteClick).toHaveBeenCalledWith("m1");
  });

  it("adds score-hover class on mouseover", () => {
    render(<ScorePreview {...defaultProps} />);
    const noteEl = document.getElementById("note-n1");
    expect(noteEl).toBeTruthy();

    fireEvent.mouseOver(noteEl!);
    expect(noteEl!.classList.contains("score-hover")).toBe(true);
  });

  it("removes score-hover class on mouseout", () => {
    render(<ScorePreview {...defaultProps} />);
    const noteEl = document.getElementById("note-n1");

    fireEvent.mouseOver(noteEl!);
    expect(noteEl!.classList.contains("score-hover")).toBe(true);

    // Mouseout to outside the container
    const container = document.querySelector(".p-4")!;
    fireEvent.mouseOut(container, { relatedTarget: document.body });
    expect(noteEl!.classList.contains("score-hover")).toBe(false);
  });

  it("applies score-active class for highlightedId", () => {
    render(<ScorePreview {...defaultProps} highlightedId="note-n2" />);
    const noteEl = document.getElementById("note-n2");
    expect(noteEl).toBeTruthy();
    expect(noteEl!.classList.contains("score-active")).toBe(true);
  });

  it("removes score-active when highlightedId changes", () => {
    const { rerender } = render(
      <ScorePreview {...defaultProps} highlightedId="note-n1" />,
    );
    expect(document.getElementById("note-n1")!.classList.contains("score-active")).toBe(true);

    rerender(<ScorePreview {...defaultProps} highlightedId="note-n2" />);
    expect(document.getElementById("note-n1")!.classList.contains("score-active")).toBe(false);
    expect(document.getElementById("note-n2")!.classList.contains("score-active")).toBe(true);
  });

  it("renders nothing when svgContent is null", () => {
    render(<ScorePreview {...defaultProps} svgContent={null} />);
    const svgElement = document.querySelector("svg");
    expect(svgElement).toBeNull();
  });
});
