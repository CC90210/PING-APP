import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const GET = withAuth(async (user) => {
    const contacts = await prisma.contact.findMany({
        where: { userId: user.id, isArchived: false },
        select: { warmthStatus: true },
    });

    const stats = {
        total: contacts.length,
        green: contacts.filter((c: any) => c.warmthStatus === "GREEN").length,
        yellow: contacts.filter((c: any) => c.warmthStatus === "YELLOW").length,
        red: contacts.filter((c: any) => c.warmthStatus === "RED").length,
        dead: contacts.filter((c: any) => c.warmthStatus === "DEAD").length,
        maintenanceRate: 0,
        weeklyInteractions: 0,
        pendingNudges: 0,
    };

    stats.maintenanceRate =
        stats.total > 0 ? Math.round((stats.green / stats.total) * 100) : 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    stats.weeklyInteractions = await prisma.interaction.count({
        where: { userId: user.id, occurredAt: { gte: weekAgo } },
    });

    stats.pendingNudges = await prisma.nudge.count({
        where: { userId: user.id, status: "PENDING" },
    });

    return NextResponse.json(stats);
});
