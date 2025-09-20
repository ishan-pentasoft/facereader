import { NextResponse } from "next/server";
import { ipqsValidatePhone } from "@/lib/ipqs.js";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const ContactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  subject: z.string().min(2, "Please add a subject"),
  phone: z.string().min(10, "Phone Number must be at least 10 characters"),
  email: z.email("Please enter a valid email address"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const values = parsed.data;

    // reCAPTCHA v3 verification
    const { captchaToken } = body || {};
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Missing captcha token" },
        { status: 400 }
      );
    }
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET || "",
          response: captchaToken,
        }),
      }
    );
    const verifyData = await verifyRes.json();
    if (
      !verifyData.success ||
      (typeof verifyData.score === "number" && verifyData.score < 0.5)
    ) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // IPQS phone validation
    const ipqs = await ipqsValidatePhone(values.phone);
    if (!ipqs.ok) {
      return NextResponse.json(
        {
          error: ipqs.error || "Phone validation failed",
          code: ipqs.code || "phone_validation_failed",
        },
        { status: 400 }
      );
    }

    await prisma.contact.create({
      data: {
        name: values.fullName,
        subject: values.subject,
        phone: values.phone,
        email: values.email,
        message: values.message,
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("/api/contact error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
