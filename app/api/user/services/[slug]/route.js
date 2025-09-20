import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Service slug is required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { slug },
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
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
