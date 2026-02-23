import { NextResponse } from "next/server";
import { ensureDbUser } from "@/lib/auth/ensure-user";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const user = await ensureDbUser();

        const queue = await prisma.contact.findMany({
            where: {
                userId: user.id,
                warmthStatus: { in: ["YELLOW", "RED", "DEAD"] },
            },
            orderBy: [{ priority: "desc" }, { warmthScore: "asc" }],
            take: 10,
            select: {
                id: true,
                name: true,
                category: true,
                warmthScore: true,
                warmthStatus: true,
                lastInteractionAt: true,
                lastInteractionChannel: true,
                desiredFrequencyDays: true,
                phone: true,
                email: true,
                avatarUrl: true,
            },
        });

        return NextResponse.json({ queue });
    } catch (error: any) {
        console.error("[DASHBOARD_QUEUE]", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
