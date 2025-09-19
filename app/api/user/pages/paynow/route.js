import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payment = await prisma.payNow.findFirst();
    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error fetching payment: ", error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}
