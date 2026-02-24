import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const GET = withAuth(async (user) => {
    const nudges = await prisma.nudge.findMany({
        where: {
            userId: user.id,
            status: { in: ["PENDING", "SNOOZED"] },
            OR: [
                { snoozedUntil: null },
                { snoozedUntil: { lte: new Date() } },
            ],
        },
        orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
        take: 20,
        include: {
            contact: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                    warmthStatus: true,
                    warmthScore: true,
                    phone: true,
                    email: true,
                    category: true,
                },
            },
        },
    });

    return NextResponse.json({ nudges });
});
