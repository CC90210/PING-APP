import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: { id: true, maxNudgesPerDay: true },
        });
        let totalNudges = 0;

        for (const user of users) {
            const coldContacts = await prisma.contact.findMany({
                where: {
                    userId: user.id,
                    isArchived: false,
                    warmthStatus: { in: ["YELLOW", "RED", "DEAD"] },
                },
                orderBy: { warmthScore: "asc" },
                take: user.maxNudgesPerDay,
            });

            for (const contact of coldContacts) {
                const existingNudge = await prisma.nudge.findFirst({
                    where: {
                        contactId: contact.id,
                        status: { in: ["PENDING", "SNOOZED"] },
                    },
                });

                if (existingNudge) continue;

                const daysSince = contact.lastInteractionAt
                    ? Math.round(
                        (Date.now() - contact.lastInteractionAt.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                    : null;

                let type: string = "WARMTH_DECAY";
                let urgency = 1;
                let title = "";
                let body = "";

                if (contact.warmthStatus === "DEAD") {
                    type = "RE_ENGAGE";
                    urgency = 3;
                    title = `Reconnect with ${contact.name}`;
                    body = daysSince
                        ? `It's been ${daysSince} days. A quick message could reignite this connection.`
                        : `You haven't connected with ${contact.name} yet. Break the ice!`;
                } else if (contact.warmthStatus === "RED") {
                    urgency = 2;
                    title = `${contact.name} is going cold`;
                    body = `${daysSince} days since your last interaction. They might think you've forgotten.`;
                } else {
                    title = `Check in with ${contact.name}`;
                    body = `It's been ${daysSince} days. Your ${contact.desiredFrequencyDays}-day goal is approaching.`;
                }

                // Birthday check
                if (contact.birthday) {
                    const today = new Date();
                    const bday = new Date(contact.birthday);
                    bday.setFullYear(today.getFullYear());
                    const daysUntilBirthday = Math.round(
                        (bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    if (daysUntilBirthday >= 0 && daysUntilBirthday <= 3) {
                        type = "BIRTHDAY";
                        urgency = 3;
                        title =
                            daysUntilBirthday === 0
                                ? `🎂 It's ${contact.name}'s birthday!`
                                : `${contact.name}'s birthday is in ${daysUntilBirthday} day${daysUntilBirthday > 1 ? "s" : ""}`;
                        body = "Send them a thoughtful message.";
                    }
                }

                await prisma.nudge.create({
                    data: {
                        userId: user.id,
                        contactId: contact.id,
                        type: type as any,
                        title,
                        body,
                        urgency,
                        suggestedAction:
                            contact.warmthStatus === "DEAD"
                                ? "Send a casual message to reconnect"
                                : "Send a quick check-in",
                    },
                });

                totalNudges++;
            }
        }

        return NextResponse.json({ success: true, nudgesCreated: totalNudges });
    } catch (error: any) {
        console.error("[GENERATE_NUDGES]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
