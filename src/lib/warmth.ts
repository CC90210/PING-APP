import prisma from "@/lib/prisma";
import { WarmthStatus } from "@prisma/client";

// Thresholds
const THRESHOLDS = {
    GREEN: 60,
    YELLOW: 30,
    RED: 10,
};

// Interaction score boosts
const BOOST: Record<string, number> = {
    OUTBOUND_MESSAGE: 5,
    INBOUND_MESSAGE: 3,
    OUTBOUND_CALL: 10,
    INBOUND_CALL: 8,
    OUTBOUND_VIDEO_CALL: 12,
    INBOUND_VIDEO_CALL: 12,
    MUTUAL_VIDEO_CALL: 12,
    OUTBOUND_VOICE_NOTE: 7,
    INBOUND_VOICE_NOTE: 7,
    MUTUAL_IN_PERSON: 15,
    OUTBOUND_IN_PERSON: 15,
    INBOUND_IN_PERSON: 15,
    OUTBOUND_EMAIL: 4,
    INBOUND_EMAIL: 4,
    OUTBOUND_SOCIAL_MEDIA: 2,
    INBOUND_SOCIAL_MEDIA: 2,
    OUTBOUND_MANUAL: 3,
    INBOUND_MANUAL: 3,
    MUTUAL_MANUAL: 3,
};

function getWarmthStatus(score: number): WarmthStatus {
    if (score >= THRESHOLDS.GREEN) return "GREEN";
    if (score >= THRESHOLDS.YELLOW) return "YELLOW";
    if (score >= THRESHOLDS.RED) return "RED";
    return "DEAD";
}

/**
 * Calculate warmth score for a single contact based on time decay.
 * Score starts at 100 after interaction and decays linearly.
 */
export function calculateWarmthScore(
    lastInteractionAt: Date | null,
    desiredFrequencyDays: number,
    now: Date = new Date()
): { score: number; status: WarmthStatus } {
    if (!lastInteractionAt) {
        return { score: 0, status: "DEAD" };
    }

    const daysSinceInteraction =
        (now.getTime() - lastInteractionAt.getTime()) / (1000 * 60 * 60 * 24);

    // Linear decay: starts at 100, hits 0 at 2x desired frequency
    const decayRate = 100 / (desiredFrequencyDays * 2);
    const score = Math.max(
        0,
        Math.min(100, 100 - daysSinceInteraction * decayRate)
    );

    return {
        score: Math.round(score * 10) / 10,
        status: getWarmthStatus(score),
    };
}

/**
 * Apply a boost when a new interaction is logged.
 * Returns new score (capped at 100).
 */
export function applyInteractionBoost(
    currentScore: number,
    interactionType: string,
    direction: string
): number {
    const key = `${direction}_${interactionType}`.toUpperCase();
    const boost = BOOST[key] || BOOST.OUTBOUND_MANUAL || 3;

    return Math.min(100, currentScore + boost);
}

/**
 * Recalculate warmth for ALL contacts of a user.
 * Called by the cron job hourly.
 */
export async function recalculateAllWarmth(userId: string): Promise<number> {
    const contacts = await prisma.contact.findMany({
        where: { userId, isArchived: false },
        select: {
            id: true,
            lastInteractionAt: true,
            desiredFrequencyDays: true,
            warmthScore: true,
            warmthStatus: true,
        },
    });

    let updated = 0;
    const now = new Date();

    for (const contact of contacts) {
        const { score, status } = calculateWarmthScore(
            contact.lastInteractionAt,
            contact.desiredFrequencyDays,
            now
        );

        if (
            Math.abs(score - contact.warmthScore) > 0.5 ||
            status !== contact.warmthStatus
        ) {
            await prisma.contact.update({
                where: { id: contact.id },
                data: { warmthScore: score, warmthStatus: status },
            });
            updated++;
        }
    }

    return updated;
}

/**
 * Update a single contact's warmth after a new interaction.
 */
export async function updateContactWarmth(
    contactId: string,
    interactionType: string,
    direction: string
): Promise<void> {
    const contact = await prisma.contact.findUnique({
        where: { id: contactId },
    });

    if (!contact) return;

    const boostedScore = applyInteractionBoost(
        contact.warmthScore,
        interactionType,
        direction
    );

    const status = getWarmthStatus(boostedScore);

    await prisma.contact.update({
        where: { id: contactId },
        data: {
            warmthScore: boostedScore,
            warmthStatus: status,
            lastInteractionAt: new Date(),
            ...(direction === "OUTBOUND" ? { lastOutboundAt: new Date() } : {}),
            ...(direction === "INBOUND" ? { lastInboundAt: new Date() } : {}),
        },
    });
}

/**
 * Backward compatibility export for existing code that calls `calculateWarmth`.
 */
export function calculateWarmth(
    lastInteractionAt: Date | null,
    desiredFrequencyDays: number,
    _interactions?: any[]
): { score: number; status: WarmthStatus } {
    return calculateWarmthScore(lastInteractionAt, desiredFrequencyDays);
}
