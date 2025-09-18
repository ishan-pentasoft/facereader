import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = Math.min(parseInt(searchParams.get("limit")) || 10, 50);
    const skip = (page - 1) * limit;

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const search = searchParams.get("search");

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { review: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const allowedSortFields = ["createdAt", "updatedAt", "name"];
    const allowedSortOrders = ["asc", "desc"];

    const finalSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const finalSortOrder = allowedSortOrders.includes(sortOrder)
      ? sortOrder
      : "desc";

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
