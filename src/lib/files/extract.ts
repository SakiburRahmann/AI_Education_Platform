import type { PDFParse } from "pdf-parse";
import type mammoth from "mammoth";

const TEXT_TYPES = new Set(["pdf", "docx", "pptx", "txt", "csv", "json", "xml", "md", "html", "rtf"]);

export function isTextExtractable(type: string): boolean {
  return TEXT_TYPES.has(type.toLowerCase());
}

export async function extractTextFromFile(
  buffer: Buffer,
  type: string
): Promise<string | null> {
  const ext = type.toLowerCase();

  switch (ext) {
    case "pdf": {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      return result.text || "";
    }
    case "docx": {
      const mammothModule = await import("mammoth");
      const result = await mammothModule.default.extractRawText({ buffer });
      return result.value;
    }
    case "pptx": {
      const { parseOffice } = await import("officeparser");
      const ast = await parseOffice(buffer);
      return ast.toText() || "";
    }
    case "txt":
    case "csv":
    case "json":
    case "xml":
    case "md":
    case "html":
    case "rtf":
      return buffer.toString("utf-8");
    default:
      return null;
  }
}

export function chunkText(text: string, maxChunkSize = 1000): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\s*\n/);
  let current = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (current.length + trimmed.length > maxChunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = "";
    }

    if (trimmed.length > maxChunkSize) {
      for (let i = 0; i < trimmed.length; i += maxChunkSize) {
        chunks.push(trimmed.slice(i, i + maxChunkSize).trim());
      }
    } else {
      current += (current ? "\n\n" : "") + trimmed;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}
