import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH: Update status (e.g., PENDING -> RESOLVED)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, severity } = body;

    // Validate that status is one of the allowed Enum values
    // (Optional: Add more strict validation here)

    const updatedReport = await prisma.report.update({
      where: { id: id }, // Remove String() wrapper since id is already string
      data: {
        status: status || undefined, // Only update if provided
        severity: severity || undefined, // Only update if provided
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 },
    );
  }
}

// DELETE: Delete a report (Optional, for Admin cleanup)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.report.delete({
      where: { id: id }, // Remove String() wrapper
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
