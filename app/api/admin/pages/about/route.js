import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { aboutSchema } from "@/validation/about.schema";

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = aboutSchema.safeParse(body);

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

    const existing = await prisma.about.findFirst();

    let result;
    if (!existing) {
      result = await prisma.about.create({ data });
    } else {
      result = await prisma.about.update({
        where: { id: existing.id },
        data,
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('About POST error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const about = await prisma.about.findFirst();
    return NextResponse.json({ data: about ?? null });
  } catch (error) {
    console.error('About GET error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
