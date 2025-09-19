import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const faceReading = await prisma.faceReading.findFirst();
    return NextResponse.json({
      success: true,
      faceReading,
    });
  } catch (error) {
    console.error("Error fetching face reading:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
