import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateVoiceNoteTalkingPoints(contactId: string, userId: string) {
    const contact = await prisma.contact.findUnique({
        where: { id: contactId, userId },
        include: {
            interactions: {
                orderBy: { occurredAt: 'desc' },
                take: 3
            }
        }
    });

    if (!contact) return [];

    const systemPrompt = `You are Ping's voice note assistant. You help users know what to say in a quick 15-second voice message. Suggest 3 concise bullet points.`;

    const userPrompt = `Contact: ${contact.name} (${contact.category})
  Last topics: ${contact.interactions.flatMap(i => i.topics).join(', ') || 'Unknown'}
  Summary: ${contact.interactions[0]?.summary || 'None'}
  
  What should I say in a quick voice note? Return as a JSON array of strings.`;

    const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
    });

    try {
        const text = (response.content[0] as any).text;
        return JSON.parse(text);
    } catch {
        return ["Ask how their week is going", "Mention you were thinking of them", "Suggest a quick catch-up"];
    }
}
