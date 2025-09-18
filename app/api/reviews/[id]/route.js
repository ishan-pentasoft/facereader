import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE({ params }) {
  try {
    const { id } = await params;

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

    await prisma.review.delete({
      where: { id },
    });

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
