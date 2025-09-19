import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { paynowSchema } from "@/validation/page.schema";

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = paynowSchema.safeParse(body);

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

    const existing = await prisma.payNow.findFirst();

    let result;
    if (!existing) {
      result = await prisma.payNow.create({ data });
    } else {
      result = await prisma.payNow.update({
        where: { id: existing.id },
        data,
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("PayNow POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const paynow = await prisma.payNow.findFirst();
    return NextResponse.json({ data: paynow ?? null });
  } catch (error) {
    console.error("Pay now GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
