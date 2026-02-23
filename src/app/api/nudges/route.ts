import { NextResponse } from "next/server";
import { ensureDbUser } from "@/lib/auth/ensure-user";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const user = await ensureDbUser();

        const nudges = await prisma.nudge.findMany({
            where: {
                userId: user.id,
                status: "PENDING",
            },
            include: {
                contact: {
                    select: {
                        id: true,
                        name: true,
                        warmthStatus: true,
                        warmthScore: true,
                        avatarUrl: true,
                        phone: true,
                        email: true,
                    },
                },
            },
            orderBy: { scheduledFor: "asc" },
        });

        return NextResponse.json({ nudges });
    } catch (error: any) {
        console.error("[NUDGES_GET]", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
