import type { PDFParse } from "pdf-parse";
import type mammoth from "mammoth";

const TEXT_TYPES = new Set(["pdf", "docx", "pptx", "txt", "csv", "json", "xml", "md", "html", "rtf"]);

export function isTextExtractable(type: string): boolean {
  return TEXT_TYPES.has(type.toLowerCase());
}

async function extractPptxText(buffer: Buffer): Promise<string> {
  const { unzipSync } = await import("fflate");
  const { DOMParser } = await import("@xmldom/xmldom");

  const files = unzipSync(new Uint8Array(buffer));

  const texts: string[] = [];
  for (const [path, data] of Object.entries(files)) {
    if (!path.startsWith("ppt/slides/slide") || !path.endsWith(".xml")) continue;
    const xml = new TextDecoder().decode(data);
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const tElements = doc.getElementsByTagNameNS("*", "t") || doc.getElementsByTagName("a:t");
    if (tElements.length === 0) {
      const allElements = doc.getElementsByTagName("*");
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        if (el.localName === "t" || el.tagName?.endsWith(":t")) {
          const text = el.textContent?.trim();
          if (text) texts.push(text);
        }
      }
    } else {
      for (let i = 0; i < tElements.length; i++) {
        const text = tElements[i].textContent?.trim();
        if (text) texts.push(text);
      }
    }
  }
  return texts.join("\n");
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
    case "pptx":
      return await extractPptxText(buffer);
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
