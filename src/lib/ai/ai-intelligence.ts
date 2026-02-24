import prisma from "@/lib/prisma";
import { summarizeInteraction } from "./claude-service";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface RelationshipInsightData {
    type: "pattern" | "reciprocity" | "trajectory" | "coaching" | "prediction";
    title: string;
    body: string;
    actionable: boolean;
    actionText?: string;
    confidence: number;
}

export async function analyzePatterns(userId: string, contactId: string) {
    const interactions = await prisma.interaction.findMany({
        where: { userId, contactId },
        orderBy: { occurredAt: 'desc' },
        take: 50
    });

    if (interactions.length < 5) return null;

    // Calculate day/time preferences
    const dayCounts: Record<number, number> = {};
    const hourCounts: Record<number, number> = {};
    let outboundCount = 0;
    let inboundCount = 0;

    interactions.forEach(i => {
        const d = new Date(i.occurredAt);
        const day = d.getDay();
        const hour = d.getHours();

        dayCounts[day] = (dayCounts[day] || 0) + 1;
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;

        if (i.direction === 'OUTBOUND') outboundCount++;
        else if (i.direction === 'INBOUND') inboundCount++;
    });

    const preferredDay = parseInt(Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0]);
    const preferredHour = parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0]);
    const initiationRatio = outboundCount / (outboundCount + inboundCount);

    // Update CommunicationPattern
    await prisma.communicationPattern.upsert({
        where: { contactId },
        update: {
            preferredDay,
            preferredHour,
            initiationRatio,
            lastAnalyzedAt: new Date()
        },
        create: {
            contactId,
            preferredDay,
            preferredHour,
            initiationRatio,
            lastAnalyzedAt: new Date()
        }
    });

    return { preferredDay, preferredHour, initiationRatio };
}

export async function generateWeeklyCoaching(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            contacts: {
                include: {
                    interactions: {
                        where: {
                            occurredAt: {
                                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) return null;

    const totalContacts = user.contacts.length;
    const healthRatio = user.contacts.filter(c => c.warmthStatus === 'GREEN').length / totalContacts;

    const systemPrompt = `You are Ping's Senior Relationship Coach. You analyze interaction data and provide warm, actionable, and strategic advice to help users maintain their human connections.

Your goal is to be:
1. Specific: Name names and mention exact numbers.
2. Strategic: Identify which groups (family, clients, etc.) are being neglected.
3. Encouraging: Celebrate wins but don't sugarcoat regressions.`;

    const userPrompt = `Analyze this week's networking data for ${user.name || 'User'}:
  - Total Contacts: ${totalContacts}
  - Relationship Health: ${Math.round(healthRatio * 100)}% Green
  - Recent Pings: ${user.contacts.reduce((acc, c) => acc + c.interactions.length, 0)}
  
  Generate a weekly coaching insight. Return as JSON:
  {
    "title": "Short catchy title",
    "body": "2-3 sentences of coaching advice",
    "actionable": true,
    "actionText": "Check Today's Queue"
  }`;

    const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
    });

    const text = (response.content[0] as any).text;
    const data = JSON.parse(text);

    return prisma.relationshipInsight.create({
        data: {
            userId,
            type: 'coaching',
            title: data.title,
            body: data.body,
            actionable: data.actionable,
            actionText: data.actionText,
            confidence: 0.9
        }
    });
}
