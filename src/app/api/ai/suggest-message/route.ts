import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { generateOutreachMessages, ContactContext } from "@/lib/ai/claude-service";
import { differenceInDays } from "date-fns";

export const POST = withAuth(async (user, request) => {
    const { contactId } = await request.json();

    if (!contactId) {
        return NextResponse.json(
            { error: "Contact ID is required" },
            { status: 400 }
        );
    }

    const contact = await prisma.contact.findFirst({
        where: { id: contactId, userId: user.id },
        include: {
            interactions: {
                orderBy: { occurredAt: "desc" },
                take: 5,
            },
        },
    });

    if (!contact) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const lastInteraction = contact.interactions[0];
    const daysSinceLast = lastInteraction
        ? differenceInDays(new Date(), new Date(lastInteraction.occurredAt))
        : 30;

    // Gather topics from recent interactions
    const lastTopics = contact.interactions
        .flatMap((i) => i.topics)
        .filter((v, i, a) => a.indexOf(v) === i);

    const context: ContactContext = {
        name: contact.name,
        category: contact.category,
        daysSinceLastInteraction: daysSinceLast,
        lastTopics,
        lastInteractionSummary: lastInteraction?.summary || null,
        birthday: contact.birthday,
        company: contact.company,
        role: contact.role,
        notes: contact.notes,
        preferredChannel: contact.lastInteractionChannel || "whatsapp",
    };

    const suggestions = await generateOutreachMessages(context, "casual");

    return NextResponse.json({
        suggestions,
        contact: {
            name: contact.name,
            preferredChannel: context.preferredChannel,
            warmthScore: contact.warmthScore,
        },
    });
});
