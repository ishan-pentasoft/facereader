import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactDetailsSchema } from "@/validation/contact.schema";

export async function GET() {
  try {
    const contact = await prisma.contactDetails.findFirst();
    return NextResponse.json({ data: contact ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = contactDetailsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const data = parsed.data;

    const existing = await prisma.contactDetails.findFirst();

    let result;
    if (!existing) {
      result = await prisma.contactDetails.create({ data });
    } else {
      result = await prisma.contactDetails.update({
        where: { id: existing.id },
        data,
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
