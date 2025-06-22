import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../auth";

const prisma = new PrismaClient();

// PUT /api/admin/slang/[id] - Update or approve/reject slang term
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action, term, meaning, example, category, isFeatured } = body;

    // Check if slang term exists
    const existingSlang = await prisma.slangTerm.findUnique({
      where: { id },
    });

    if (!existingSlang) {
      return NextResponse.json(
        { success: false, error: "Slang term not found" },
        { status: 404 }
      );
    }

    let updateData: any = {};

    if (action === "approve") {
      updateData = {
        status: "approved",
        approvedBy: session.user?.email,
        approvedAt: new Date(),
      };
    } else if (action === "reject") {
      updateData = {
        status: "rejected",
        approvedBy: session.user?.email,
        approvedAt: new Date(),
      };
    } else if (action === "feature") {
      updateData = {
        isFeatured: !existingSlang.isFeatured,
      };
    } else {
      // Regular update
      updateData = {
        ...(term && { term: term.toLowerCase().trim() }),
        ...(meaning && { meaning: meaning.trim() }),
        ...(example !== undefined && { example: example?.trim() || null }),
        ...(category && { category: category.trim() }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        updatedAt: new Date(),
      };

      // If updating term, check for uniqueness
      if (term && term.toLowerCase().trim() !== existingSlang.term) {
        const duplicateTerm = await prisma.slangTerm.findUnique({
          where: { term: term.toLowerCase().trim() },
        });

        if (duplicateTerm) {
          return NextResponse.json(
            { success: false, error: "This slang term already exists" },
            { status: 409 }
          );
        }
      }
    }

    const updatedSlang = await prisma.slangTerm.update({
      where: { id },
      data: updateData,
    });

    const message =
      action === "approve"
        ? "Slang term approved successfully!"
        : action === "reject"
          ? "Slang term rejected successfully!"
          : action === "feature"
            ? `Slang term ${updatedSlang.isFeatured ? "featured" : "unfeatured"} successfully!`
            : "Slang term updated successfully!";

    return NextResponse.json({
      success: true,
      message,
      data: updatedSlang,
    });
  } catch (error) {
    console.error("Error updating slang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update slang term" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/slang/[id] - Delete slang term
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if slang term exists
    const existingSlang = await prisma.slangTerm.findUnique({
      where: { id },
    });

    if (!existingSlang) {
      return NextResponse.json(
        { success: false, error: "Slang term not found" },
        { status: 404 }
      );
    }

    await prisma.slangTerm.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Slang term deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting slang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete slang term" },
      { status: 500 }
    );
  }
}
