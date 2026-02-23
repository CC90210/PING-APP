import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "@/lib/prisma";
import { NudgeType, NudgeStatus } from "@prisma/client";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
});

export const nudgeWorker = new Worker("nudge-generator", async (job) => {
    // 1. Query contacts needing nudges
    // contacts with YELLOW or RED status, who don't have a PENDING nudge
    const contacts = await prisma.contact.findMany({
        where: {
            warmthStatus: { in: ['YELLOW', 'RED', 'DEAD'] },
            nudges: {
                none: {
                    status: NudgeStatus.PENDING
                }
            }
        },
        include: {
            user: {
                include: { settings: true }
            }
        }
    });

    for (const contact of contacts) {
        if (!contact.user.settings?.pushNotifications) continue;

        // 2. Generate nudge based on status
        let message = `You haven't talked to ${contact.name} in a while.`;
        let type = NudgeType.WARMTH_DECAY;
        let reason = "Relationship cooling";

        if (contact.warmthStatus === 'RED') {
            message = `${contact.name} is now in the RED zone. Send them a quick ping!`;
            reason = "Relationship is cold";
        } else if (contact.warmthStatus === 'DEAD') {
            message = `${contact.name} is starting to feel like a ghost. Want to reconnect?`;
            type = NudgeType.RE_ENGAGE;
            reason = "Relationship is dead";
        }

        // 3. Create the nudge
        await prisma.nudge.create({
            data: {
                userId: contact.userId,
                contactId: contact.id,
                type,
                message,
                reason,
                scheduledFor: new Date(),
                status: NudgeStatus.PENDING,
                suggestedChannel: contact.lastInteractionChannel || "whatsapp"
            }
        });

        console.log(`Generated ${type} nudge for ${contact.name}`);
    }

    // 4. Birthday checks
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const birthdayContacts = await prisma.contact.findMany({
        where: {
            birthday: {
                not: null
            },
            nudges: {
                none: {
                    type: NudgeType.BIRTHDAY,
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }
        }
    });

    for (const contact of birthdayContacts) {
        if (!contact.birthday) continue;

        const bday = new Date(contact.birthday);
        if (bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate()) {
            await prisma.nudge.create({
                data: {
                    userId: contact.userId,
                    contactId: contact.id,
                    type: NudgeType.BIRTHDAY,
                    message: `It's ${contact.name}'s birthday today! 🎂`,
                    reason: "Birthday today",
                    scheduledFor: new Date(),
                    status: NudgeStatus.PENDING
                }
            });
        } else if (bday.getMonth() === tomorrow.getMonth() && bday.getDate() === tomorrow.getDate()) {
            await prisma.nudge.create({
                data: {
                    userId: contact.userId,
                    contactId: contact.id,
                    type: NudgeType.BIRTHDAY,
                    message: `${contact.name}'s birthday is tomorrow!`,
                    reason: "Birthday tomorrow",
                    scheduledFor: new Date(),
                    status: NudgeStatus.PENDING
                }
            });
        }
    }

}, { connection });
