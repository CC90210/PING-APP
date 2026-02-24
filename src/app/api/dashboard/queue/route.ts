import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const GET = withAuth(async (user) => {
    const queue = await prisma.contact.findMany({
        where: {
            userId: user.id,
            isArchived: false,
            warmthStatus: { in: ["YELLOW", "RED", "DEAD"] },
        },
        orderBy: [{ priority: "desc" }, { warmthScore: "asc" }],
        take: 10,
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            avatarUrl: true,
            category: true,
            priority: true,
            warmthScore: true,
            warmthStatus: true,
            lastInteractionAt: true,
            lastInteractionChannel: true,
            desiredFrequencyDays: true,
            linkedinUrl: true,
            nudges: {
                where: { status: "PENDING" },
                take: 1,
                select: { title: true, body: true, type: true },
            },
        },
    });

    return NextResponse.json({ queue });
});
