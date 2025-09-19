import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Only delete files from our uploads directory
    if (!imageUrl.startsWith("/api/uploads/")) {
      return NextResponse.json(
        { error: "Can only delete uploaded files" },
        { status: 400 }
      );
    }

    // Extract filename from URL (e.g., '/api/uploads/filename.jpg' -> 'filename.jpg')
    const filename = imageUrl.split("/").pop();
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    // Check if file exists before trying to delete
    if (existsSync(filePath)) {
      await unlink(filePath);
      return NextResponse.json({ 
        success: true, 
        message: "Image deleted successfully" 
      });
    } else {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
