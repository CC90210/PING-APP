import prisma from '@/lib/prisma';
import { calculateWarmth } from '@/lib/warmth';
import { nudgeQueue } from '@/lib/queue';
import { InboundMessage } from './gateway-client';
import { InteractionType, WarmthStatus } from '@prisma/client';

export async function processInboundMessage(
    userId: string,
    message: InboundMessage
): Promise<void> {

    // 1. Find matching contact
    // We search for the platform-specific ID in the linkedPlatforms array
    // e.g. "whatsapp:+14155551212"
    const platformKey = `${message.channel}:${message.senderJid}`;

    const contact = await prisma.contact.findFirst({
        where: {
            userId,
            linkedPlatforms: { has: platformKey }
        },
        include: {
            interactions: {
                orderBy: { occurredAt: 'desc' },
                take: 20 // For warmth calculation
            }
        }
    });

    if (!contact) {
        console.log(`Unknown contact for ${platformKey}. Queueing for review.`);
        // Potential: Auto-create acquaintance or log to a special "Pending Review" table
        return;
    }

    // 2. Log the interaction
    const interaction = await prisma.interaction.create({
        data: {
            userId,
            contactId: contact.id,
            type: 'MESSAGE',
            channel: message.channel,
            direction: message.isFromMe ? 'outbound' : 'inbound',
            occurredAt: new Date(message.timestamp),
            isAutoLogged: true,
            sourceMessageId: message.id,
            // summary: message.text, // Normally summarize first via AI, but logging raw for now if needed (careful with privacy)
        },
    });

    // 3. Update contact's last interaction info
    const newWarmth = calculateWarmth(
        new Date(message.timestamp),
        contact.desiredFrequencyDays,
        [...contact.interactions, {
            type: InteractionType.MESSAGE,
            direction: message.isFromMe ? 'outbound' : 'inbound',
            occurredAt: new Date(message.timestamp)
        }]
    );

    await prisma.contact.update({
        where: { id: contact.id },
        data: {
            lastInteractionAt: new Date(message.timestamp),
            lastInteractionType: 'message',
            lastInteractionChannel: message.channel,
            warmthScore: newWarmth.score,
            warmthStatus: newWarmth.status as WarmthStatus
        },
    });

    // 4. Queue AI processing (Summary & Topics)
    // This would be handled by a worker listening to a queue
    // nudgeQueue.add(...)
}
