import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateCsrfToken, extractCsrfToken } from "@/lib/csrf";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const DOCUMENT_TYPES = new Set(["pdf", "docx", "pptx", "txt", "csv", "json", "xml", "md", "rtf"]);
// HTML removed from DOCUMENT_TYPES — HTML files pose a Stored XSS risk in Supabase Storage
const IMAGE_TYPES = new Set(["png", "jpg", "jpeg", "gif", "webp"]);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── CSRF validation ──────────────────────────────────────────
    const csrfToken = extractCsrfToken(request);
    if (!csrfToken || !validateCsrfToken(csrfToken, user.id, user.id)) {
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

    // Validate file extension against allowed types
    if (!DOCUMENT_TYPES.has(ext) && !IMAGE_TYPES.has(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Verify magic bytes for common types
    const isValidContent = validateFileContent(buffer, ext);
    if (!isValidContent) {
      return NextResponse.json({
        error: "File content does not match its extension",
      }, { status: 400 });
    }

    let storagePath: string | null = null;

    // Only store documents in Supabase Storage, not photos
    const shouldStoreInSupabase = DOCUMENT_TYPES.has(ext);

    // Store documents in Supabase Storage
    if (shouldStoreInSupabase) {
      const filePath = `${user.id}/${Date.now()}_${name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("study-materials")
        .upload(filePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase storage upload failed:", uploadError.message);
      } else {
        storagePath = uploadData.path;
      }

      // Record file in database
      await supabase.from("files").insert({
        user_id: user.id,
        name,
        type: ext,
        size: file.size,
        status: storagePath ? "ready" : "processing",
        storage_path: storagePath,
      });
    }

    // For documents, return extracted text; for images, return dataUrl
    let text: string | null = null;
    let dataUrl: string | undefined;

    if (IMAGE_TYPES.has(ext)) {
      const mimeType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;
      dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({
      name,
      type: ext,
      size: file.size,
      text,
      dataUrl,
      storagePath,
      stored: !!storagePath,
    });
  } catch (error: any) {
    console.error("File upload error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

/**
 * Validate file content magic bytes against the declared extension.
 * Prevents MIME type spoofing attacks.
 */
function validateFileContent(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return true; // Too small to validate

  const header = buffer.toString("hex", 0, Math.min(8, buffer.length)).toUpperCase();

  switch (ext) {
    case "pdf":
      return header.startsWith("25504446"); // %PDF
    case "png":
      return header.startsWith("89504E47"); // PNG
    case "jpg":
    case "jpeg":
      return header.startsWith("FFD8"); // JPEG
    case "gif":
      return header.startsWith("47494638"); // GIF
    case "webp":
      return header.startsWith("52494646"); // RIFF (WEBP)
    case "zip":
    case "docx":
    case "pptx":
      return header.startsWith("504B0304"); // ZIP
    default:
      return true; // Text types skip magic byte validation
  }
}
