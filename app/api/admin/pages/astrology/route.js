import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pageSchema } from "@/validation/page.schema";

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = pageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.astrology.findFirst();

    let result;
    if (!existing) {
      result = await prisma.astrology.create({ data });
    } else {
      result = await prisma.astrology.update({
        where: { id: existing.id },
        data,
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Astrology POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const astrology = await prisma.astrology.findFirst();
    return NextResponse.json({ data: astrology ?? null });
  } catch (error) {
    console.error("Astrology GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
