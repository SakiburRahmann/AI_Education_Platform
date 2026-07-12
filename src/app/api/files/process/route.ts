import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTextFromFile, isTextExtractable } from "@/lib/files/extract";
import { validateCsrfToken, extractCsrfToken } from "@/lib/csrf";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const IMAGE_TYPES = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico", "avif"]);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── CSRF validation ──────────────────────────────────────────
    const csrfToken = extractCsrfToken(request);
    if (!csrfToken || !(await validateCsrfToken(csrfToken, user.id, user.id))) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

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

    if (!isTextExtractable(ext) && !IMAGE_TYPES.has(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
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
        console.error(`Text extraction failed for ${name}:`, e instanceof Error ? e.message : String(e));
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
    console.error("File processing error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
