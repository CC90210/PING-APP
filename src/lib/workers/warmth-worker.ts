import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "@/lib/prisma";
import { calculateWarmth } from "@/lib/warmth";
import { WarmthStatus } from "@prisma/client";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
});

export const warmthWorker = new Worker("warmth-recalculate", async (job) => {
    const users = await prisma.user.findMany();

    for (const user of users) {
        const contacts = await prisma.contact.findMany({
            where: { userId: user.id },
            include: {
                interactions: {
                    where: {
                        occurredAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                        }
                    },
                    orderBy: { occurredAt: 'desc' }
                }
            }
        });

        for (const contact of contacts) {
            const { score, status } = calculateWarmth(
                contact.lastInteractionAt,
                contact.desiredFrequencyDays,
                contact.interactions
            );

            // Status changed?
            const statusChanged = contact.warmthStatus !== status;

            await prisma.contact.update({
                where: { id: contact.id },
                data: {
                    warmthScore: score,
                    warmthStatus: status as WarmthStatus
                }
            });

            if (statusChanged && (status === WarmthStatus.YELLOW || status === WarmthStatus.RED)) {
                // Trigger nudge generation for this contact
                // We'll implement specific nudge generation logic later
                console.log(`Status changed for ${contact.name}: ${contact.warmthStatus} -> ${status}`);
            }
        }
    }
}, { connection });
