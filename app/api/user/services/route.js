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

    let where = {};

    if (search) {
      where.OR = [{ title: { contains: search, mode: "insensitive" } }];
    }

    const allowedSortFields = ["createdAt", "updatedAt", "title", "price"];
    const allowedSortOrders = ["asc", "desc"];

    const finalSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const finalSortOrder = allowedSortOrders.includes(sortOrder)
      ? sortOrder
      : "desc";

    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: {
          [finalSortBy]: finalSortOrder,
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          price: true,
          currency: true,
          image: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.service.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      services,
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
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
