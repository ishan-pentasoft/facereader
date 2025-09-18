import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(request, { params }) {
  try {
    const { path: filePath } = await params;
    const fileName = filePath.join("/");

    // Security: prevent directory traversal
    if (fileName.includes("..") || fileName.includes("\\")) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    const fullPath = path.join(process.cwd(), "public", "uploads", fileName);

    if (!existsSync(fullPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = await readFile(fullPath);

    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    const contentType = getContentType(ext);

    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

function getContentType(ext) {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
