import { InteractionType, WarmthStatus } from "@prisma/client";
import { differenceInDays } from "date-fns";

export interface WarmthResult {
    score: number;
    status: WarmthStatus;
}

export function calculateWarmth(
    lastInteractionAt: Date | null,
    desiredFrequencyDays: number,
    interactions: { type: InteractionType; direction: string; occurredAt: Date }[]
): WarmthResult {
    if (!lastInteractionAt) {
        return { score: 0, status: WarmthStatus.DEAD };
    }

    const today = new Date();
    const daysSinceLast = differenceInDays(today, lastInteractionAt);

    // Base decay: 100 down to 0 over desiredFrequencyDays
    const decayRate = 100 / (desiredFrequencyDays || 14);
    let score = 100 - (daysSinceLast * decayRate);

    // Add boosters for interactions within the last decay period or just apply them to the base?
    // The brief says "after any interaction base score 100", 
    // but also mention boosters: "+5 for outbound... +10 for calls"
    // This implies the 100 is the STARTING point after the VERY LAST interaction, 
    // but maybe multiple recent interactions boost the score beyond 100 or slow down decay?

    // Let's interpret it as: every interaction resets to a "effective last date" or adds to the score.
    // Actually, the simplest interpretation is: 
    // Score = 100 - (days_since_last * decay_rate) + Boosters(recent_interactions)

    // Let's refine:
    // We only look at interactions since the last reset (if we had a reset logic).
    // But Prisma schema just has `lastInteractionAt`.

    // Let's assume boosters apply to the current score.
    let boosters = 0;
    // Let's only look at interactions in the last 30 days or since the last reset.
    for (const interaction of interactions) {
        // Only boost if it happened in the last 7 days to avoid permanent boosters
        const interactionAge = differenceInDays(today, interaction.occurredAt);
        if (interactionAge <= 7) {
            if (interaction.type === InteractionType.CALL || interaction.type === InteractionType.MEETING || interaction.type === InteractionType.VIDEO_CALL) {
                boosters += 10;
            } else if (interaction.direction === "outbound") {
                boosters += 5;
            } else if (interaction.direction === "inbound") {
                boosters += 3;
            }
        }
    }

    score = Math.min(100, Math.max(0, score + boosters));

    let status = WarmthStatus.DEAD;
    if (score >= 60) {
        status = WarmthStatus.GREEN;
    } else if (score >= 30) {
        status = WarmthStatus.YELLOW;
    } else if (score >= 10) {
        status = WarmthStatus.RED;
    }

    return { score, status };
}
