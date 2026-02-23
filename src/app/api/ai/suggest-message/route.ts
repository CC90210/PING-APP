import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import prisma from "@/lib/prisma";
import { generateOutreachMessages, ContactContext } from "@/lib/ai/claude-service";
import { differenceInDays } from "date-fns";

export async function POST(req: Request) {
    try {
        const user = await getOrCreateUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { contactId } = await req.json();

        if (!contactId) {
            return new NextResponse("Contact ID is required", { status: 400 });
        }

        const contact = await prisma.contact.findUnique({
            where: {
                id: contactId,
                userId: user.id
            },
            include: {
                interactions: {
                    orderBy: { occurredAt: 'desc' },
                    take: 5
                }
            }
        });

        if (!contact) {
            return new NextResponse("Contact not found", { status: 404 });
        }

        const userSettings = await prisma.userSettings.findUnique({
            where: { userId: user.id }
        });

        // Build context
        const lastInteraction = contact.interactions[0];
        const daysSinceLast = lastInteraction
            ? differenceInDays(new Date(), new Date(lastInteraction.occurredAt))
            : 30; // Default to 30 if no interactions

        // Gather topics from recent interactions
        const lastTopics = contact.interactions
            .flatMap(i => i.topicsDiscussed)
            .filter((v, i, a) => a.indexOf(v) === i); // Unique topics

        const context: ContactContext = {
            name: contact.name,
            category: contact.category,
            daysSinceLastInteraction: daysSinceLast,
            lastTopics: lastTopics,
            lastInteractionSummary: lastInteraction?.summary || null,
            birthday: contact.birthday,
            company: contact.company,
            role: contact.role,
            notes: contact.notes,
            preferredChannel: contact.lastInteractionChannel || "whatsapp"
        };

        const suggestions = await generateOutreachMessages(
            context,
            userSettings?.aiMessageTone || "casual"
        );

        return NextResponse.json({
            suggestions,
            contact: {
                name: contact.name,
                preferredChannel: context.preferredChannel,
                warmthScore: contact.warmthScore
            }
        });
    } catch (error) {
        console.error("[AI_SUGGEST_MESSAGE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
