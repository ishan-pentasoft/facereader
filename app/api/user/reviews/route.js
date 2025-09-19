import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, image, review } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!review || typeof review !== "string" || review.trim().length === 0) {
      return NextResponse.json(
        { error: "Review is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Create the review in database
    const newReview = await prisma.review.create({
      data: {
        name: name.trim(),
        image: image || "",
        review: review.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A review with this data already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
