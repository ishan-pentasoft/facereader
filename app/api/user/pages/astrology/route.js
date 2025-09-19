import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const astrology = await prisma.astrology.findFirst();
    return NextResponse.json({
      success: true,
      astrology,
    });
  } catch (error) {
    console.error("Error fetching astrology:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
