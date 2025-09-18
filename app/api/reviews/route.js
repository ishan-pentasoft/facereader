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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = Math.min(parseInt(searchParams.get("limit")) || 10, 50);
    const skip = (page - 1) * limit;

    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Filtering parameters
    const search = searchParams.get("search");

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { review: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Validate sort parameters
    const allowedSortFields = ["createdAt", "updatedAt", "name"];
    const allowedSortOrders = ["asc", "desc"];

    const finalSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const finalSortOrder = allowedSortOrders.includes(sortOrder)
      ? sortOrder
      : "desc";

    // Fetch reviews with pagination
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: {
          [finalSortBy]: finalSortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
      filters: {
        search: search || null,
        sortBy: finalSortBy,
        sortOrder: finalSortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
