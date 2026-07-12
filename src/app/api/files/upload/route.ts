import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const DOCUMENT_TYPES = new Set(["pdf", "docx", "pptx", "txt", "csv", "json", "xml", "md", "html", "rtf"]);
const IMAGE_TYPES = new Set(["png", "jpg", "jpeg", "gif", "webp"]);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Only store documents in Supabase Storage, not photos
    const shouldStoreInSupabase = DOCUMENT_TYPES.has(ext);
    const isImage = IMAGE_TYPES.has(ext);

    if (!shouldStoreInSupabase && !isImage) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let storagePath: string | null = null;

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
        console.warn("Supabase storage upload failed:", uploadError.message);
        // Fall back to returning the data URL only (no persistent storage)
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

    if (isImage) {
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
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
