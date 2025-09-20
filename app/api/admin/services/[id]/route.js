import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serviceUpdateSchema } from "@/validation/service.schema";
import { unlink } from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const validationResult = serviceUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (
      validationResult.data.slug &&
      validationResult.data.slug !== existingService.slug
    ) {
      const slugExists = await prisma.service.findUnique({
        where: { slug: validationResult.data.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A service with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await prisma.service.delete({
      where: { id },
    });

    if (
      existingService.image &&
      existingService.image.startsWith("/api/uploads/") &&
      !existingService.image.includes("placeholder")
    ) {
      try {
        const filename = existingService.image.split("/").pop();
        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          filename
        );

        await unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting image file:", fileError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
      deletedService: existingService,
    });
  } catch (error) {
    console.error("Error deleting service:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
