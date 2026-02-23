import { NextResponse } from "next/server";
import { ensureDbUser } from "@/lib/auth/ensure-user";
import prisma from "@/lib/prisma";
import { calculateWarmth } from "@/lib/warmth";

export async function POST() {
    try {
        const user = await ensureDbUser();

        const contacts = await prisma.contact.findMany({
            where: { userId: user.id },
            include: {
                interactions: {
                    orderBy: { occurredAt: "desc" },
                    take: 10,
                },
            },
        });

        let updated = 0;

        for (const contact of contacts) {
            const result = calculateWarmth(
                contact.lastInteractionAt,
                contact.desiredFrequencyDays,
                contact.interactions
            );

            if (
                result.score !== contact.warmthScore ||
                result.status !== contact.warmthStatus
            ) {
                await prisma.contact.update({
                    where: { id: contact.id },
                    data: {
                        warmthScore: result.score,
                        warmthStatus: result.status,
                    },
                });
                updated++;
            }
        }

        return NextResponse.json({ updated, total: contacts.length });
    } catch (error: any) {
        console.error("[WARMTH_RECALCULATE]", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
