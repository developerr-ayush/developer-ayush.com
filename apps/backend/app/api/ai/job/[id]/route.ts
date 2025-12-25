import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "../../../../../lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Await params as required in Next.js 15+
        const { id } = await Promise.resolve(params);

        if (!id) {
            return NextResponse.json({ success: false, error: "Job ID required" }, { status: 400 });
        }

        const job = await db.generationJob.findUnique({
            where: { id },
        });

        if (!job) {
            return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            status: job.status,
            result: job.result ? JSON.parse(job.result) : null,
            error: job.error,
        });

    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch job status" }, { status: 500 });
    }
}
