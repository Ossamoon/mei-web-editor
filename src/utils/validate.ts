import { SaxesParser } from "saxes";

export interface XmlError {
  message: string;
  line: number; // 1-based
  column: number; // 0-based
}

export interface ValidationResult {
  valid: boolean;
  errors: XmlError[];
}

export function validateXml(xmlString: string): ValidationResult {
  if (!xmlString.trim()) {
    return { valid: false, errors: [{ message: "Empty document", line: 1, column: 0 }] };
  }

  const parser = new SaxesParser();
  const errors: XmlError[] = [];

  parser.on("error", (err) => {
    errors.push({
      message: err.message,
      line: parser.line,
      column: parser.column,
    });
  });

  parser.write(xmlString);
  parser.close();

  return { valid: errors.length === 0, errors };
}
