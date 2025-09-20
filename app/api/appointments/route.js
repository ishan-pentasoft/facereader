import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { appointmentFormSchema } from "@/validation/appointment.schema";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = appointmentFormSchema.parse(body);

    const service = await prisma.service.findUnique({
      where: { slug: validatedData.serviceSlug },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    // Convert dateOfBirth string to Date object
    const dateOfBirth = new Date(validatedData.dateOfBirth);

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        serviceId: service.id,
        dateOfBirth: dateOfBirth,
        timeOfBirth: validatedData.timeOfBirth,
        placeOfBirth: validatedData.placeOfBirth,
        additionalNotes: validatedData.additionalNotes || null,
        status: "pending",
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create appointment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          service: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch appointments",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
