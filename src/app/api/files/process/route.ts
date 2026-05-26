import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/files/extract";

const ALLOWED_TYPES = new Set(["pdf", "docx", "pptx", "txt"]);
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const name = file.name;
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_TYPES.has(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type: .${ext}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromFile(buffer, ext);

    return NextResponse.json({
      name,
      type: ext,
      size: file.size,
      text,
      pages: text.length > 0 ? Math.ceil(text.length / 3000) : 0,
    });
  } catch (error: any) {
    console.error("File processing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process file" },
      { status: 500 }
    );
  }
}
