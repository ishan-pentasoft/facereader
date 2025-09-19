import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kundaliDosha = await prisma.kundaliDosha.findFirst();
    return NextResponse.json({
      success: true,
      kundaliDosha,
    });
  } catch (error) {
    console.error("Error fetching Kundali Dosha:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
