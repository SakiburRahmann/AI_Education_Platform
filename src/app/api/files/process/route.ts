import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile, isTextExtractable } from "@/lib/files/extract";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const IMAGE_TYPES = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico", "avif"]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const name = file.name;
    const ext = name.split(".").pop()?.toLowerCase() || "unknown";

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    let text: string | null = null;
    let pages = 0;
    let dataUrl: string | undefined;

    const buffer = Buffer.from(await file.arrayBuffer());

    if (isTextExtractable(ext)) {
      try {
        text = await extractTextFromFile(buffer, ext);
        pages = text ? Math.ceil(text.length / 3000) : 0;
      } catch (e) {
        console.warn(`Text extraction failed for ${name}:`, e);
        text = null;
        pages = 0;
      }
    }

    if (IMAGE_TYPES.has(ext)) {
      const mimeType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;
      dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({
      name,
      type: ext,
      size: file.size,
      text,
      pages,
      dataUrl,
      unprocessable: text === null,
    });
  } catch (error: any) {
    console.error("File processing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process file" },
      { status: 500 }
    );
  }
}
