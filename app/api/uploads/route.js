import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_SIZE_BYTES = 10 * 1024 * 1024; //10mb

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file) {
      return NextResponse.json(
        { error: "file is required (form field 'file')" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File too large. Max ${Math.round(
            MAX_SIZE_BYTES / (1024 * 1024)
          )}MB`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Build a safe filename
    const ext = mimeToExtension(file.type);
    const base = sanitizeBase(file.name.replace(/\.[^/.]+$/, "")) || "upload";
    const unique = crypto.randomBytes(6).toString("hex");
    const fileName = `${base}-${Date.now()}-${unique}${ext}`;
    const fullPath = path.join(uploadsDir, fileName);

    await writeFile(fullPath, buffer);

    const url = `/api/uploads/${fileName}`;
    return NextResponse.json({
      success: true,
      url,
      name: fileName,
      size: file.size,
      type: file.type,
    });
  } catch (e) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status }
    );
  }
}

function sanitizeBase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function mimeToExtension(mime) {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    default:
      return "";
  }
}
