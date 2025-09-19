import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const vastu = await prisma.vastu.findFirst();
    return NextResponse.json({
      success: true,
      vastu,
    });
  } catch (error) {
    console.error("Error fetching vastu:", error);
    return NextResponse.json({
      error: "Internal server error",
      status: 500,
    });
  }
}
