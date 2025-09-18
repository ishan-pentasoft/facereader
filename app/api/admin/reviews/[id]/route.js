import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE({ params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Delete the review from database first
    await prisma.review.delete({
      where: { id },
    });

    // Delete associated image file if it exists and is not a default/external image
    if (
      existingReview.image &&
      existingReview.image.startsWith("/api/uploads/") &&
      !existingReview.image.includes("avatar.iran.liara.run")
    ) {
      try {
        // Extract filename from URL (e.g., '/api/uploads/filename.jpg' -> 'filename.jpg')
        const filename = existingReview.image.split("/").pop();
        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          filename
        );

        await unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting image file:", fileError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
      deletedReview: existingReview,
    });
  } catch (error) {
    console.error("Error deleting review:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
