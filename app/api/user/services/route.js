import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
  try {
    const services = await prisma.service.findMany();

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
