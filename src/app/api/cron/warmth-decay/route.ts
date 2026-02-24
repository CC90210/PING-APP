import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recalculateAllWarmth } from "@/lib/warmth";

function verifyCronSecret(request: Request): boolean {
    const authHeader = request.headers.get("authorization");
    return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request: Request) {
    if (!verifyCronSecret(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const log = await prisma.cronJobLog.create({
        data: { jobName: "warmth-decay", status: "started" },
    });

    try {
        const users = await prisma.user.findMany({ select: { id: true } });

        let totalUpdated = 0;
        for (const user of users) {
            const updated = await recalculateAllWarmth(user.id);
            totalUpdated += updated;
        }

        await prisma.cronJobLog.update({
            where: { id: log.id },
            data: {
                status: "completed",
                result: {
                    usersProcessed: users.length,
                    contactsUpdated: totalUpdated,
                },
                completedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            usersProcessed: users.length,
            contactsUpdated: totalUpdated,
        });
    } catch (error: any) {
        await prisma.cronJobLog.update({
            where: { id: log.id },
            data: { status: "failed", error: error.message, completedAt: new Date() },
        });

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
